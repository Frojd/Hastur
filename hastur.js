#!/usr/bin/env node

const http = require('http');
const path = require('path');

const ReactDOMServer = require('react-dom/server');
const React = require('react');

const purgeCache = require('./utils').purgeCache;
const snakeToCamelCase = require('./utils').snakeCaseToCamelCase;

const args = process.argv;

const env = process.env;
const envPath = env.HASTUR_PATH;
const envHost = env.HASTUR_HOST;
const envPort = env.HASTUR_PORT;
const envDebug = env.HASTUR_DEBUG;
const envSentry = env.HASTUR_SENTRY;
const envCamel = env.HASTUR_JSON_SNAKE_TO_CAMEL;
const stripDotPrefix = env.HASTUR_STRIP_DOT_PREFIX;

let Raven;
let sentry;
try {
    Raven = require('raven');
    sentry = args.indexOf('sentry') !== -1 ? args[args.indexOf('sentry') + 1] : envSentry ? envSentry : '';
    Raven.config(sentry).install();
    console.log('Raven installed')
} catch(e) {
    console.log('Raven is not installed', e);
    Raven = {};
    Raven.captureException = function(){};
}

const hostname = args.indexOf('host') !== -1 ? args[args.indexOf('host') + 1] : envHost ? envHost : '0.0.0.0';
const port = args.indexOf('port') !== -1 ? args[args.indexOf('port') + 1] : envPort ? envPort : 3000;
const componentFolderPath = args.indexOf('path') !== -1 ? args[args.indexOf('path') + 1] : envPath ? envPath : '';
const debug = args.indexOf('debug') !== -1 ? true : envDebug ? envDebug : false;
const parseJson = args.indexOf('toCamelFromSnake') !== -1 ? true : envCamel ? envCamel : false;
const removeDotPrefix = args.indexOf('stripDotPrefix') !== -1 ? true : stripDotPrefix ? stripDotPrefix : false;

const server = http.createServer((req, res) => {
    let body = '';
    if(req.method === 'GET') {
        res.statusCode = 405;
        return res.end();
    }
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        if(!body) {
            res.statusCode = 400;
            return res.end('Missing body parameter');
        }

        let jsonObj = JSON.parse(body);

        if(!jsonObj) {
            res.statusCode = 400;
            return res.end('Body is not json serializable');
        }

        if(!jsonObj.componentName) {
            res.statusCode = 400;
            return res.end('Missing componentName');
        }

        let componentName = jsonObj.componentName;
        let props = jsonObj.props || {};

        if(parseJson) {
            props = snakeToCamelCase(props);
        }

        try {
            let component = jsonObj.static ?
                renderStaticServerComponent(componentName, props) : renderServerComponent(componentName, props);
            if(debug) {
                console.log(`Server rendering component: ${componentName}` )
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8;');
            res.end(component);
        } catch(e) {
            if(debug) {
                console.error(e);    
            }
            try {
                if(sentry) {
                    Raven.captureException(e);
                }
            } catch(ex) {
                console.error('Raven failed to log error:', ex)
            }
            
            res.statusCode = 500;
            return res.end(`Exception on ${componentName}. ${e}`);
        }
    });
});

function getComponentElement(componentName, data) {
    let parsedComponentName = componentName;
    if(removeDotPrefix) {
        const componentNames = componentName.split('.');
        parsedComponentName = componentNames[componentNames.length-1];
    }

    const componentPath = path.posix.join(componentFolderPath, parsedComponentName);
    
    let component = require(componentPath);
    if(debug) {
        purgeCache(componentPath, componentFolderPath);
    }

    let element = React.createElement(component.default, data);
    return element;
}

function renderStaticServerComponent(componentName, data) {
    let element = getComponentElement(componentName, data);
    let renderedComponent = ReactDOMServer.renderToStaticMarkup(element);
    return renderedComponent;
}

function renderServerComponent(componentName, data) {
    let element = getComponentElement(componentName, data);
    let renderedComponent = ReactDOMServer.renderToString(element);
    return renderedComponent;
}

server.listen(port, hostname, () => {
    if(debug) {
        console.log(`Debug mode is set to: ${!!debug}`);
    }
    console.log(`Server running at http://${hostname}:${port}/\nBase components folder: ${componentFolderPath}`);
});

module.exports = { getComponentElement, renderServerComponent, renderStaticServerComponent, server }

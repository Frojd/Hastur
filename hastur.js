#!/usr/bin/env node

const http = require('http');
const path = require('path');

const ReactDOMServer = require('react-dom/server')
const React = require('react');

const args = process.argv;

let Raven;
try {
    let Raven = require('raven');
    Raven.config(args[args.indexOf('sentry') + 1]).install();
    console.log('raven installed')
} catch(e) {
    console.log('Raven is not installed', e);
    Raven = {};
    Raven.captureException = function(){};
}

const hostname = args.indexOf('host') !== -1 ? args[args.indexOf('host') + 1] : '0.0.0.0';
const port = args.indexOf('port') !== -1 ? args[args.indexOf('port') + 1] : 3000;
const componentFolderPath = args.indexOf('path') !== -1 ? args[args.indexOf('path') + 1] : '';

const server = http.createServer((req, res) => {
    let body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        if(!body) {
            res.statusCode = 400;
            return res.end('Missing body');
        }

        let jsonObj = JSON.parse(body);

        if(!jsonObj) {
            res.statusCode = 400;
            return res.end('Missing body');
        }

        if(!jsonObj.componentName) {
            res.statusCode = 400;
            return res.end('Missing componentName');
        }

        let componentName = jsonObj.componentName;
        let props = jsonObj.props || {};

        try {
            let component = jsonObj.static ?
                renderStaticServerComponent(componentName, props) : renderServerComponent(componentName, props);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(component);
        } catch(e) {
            Raven.captureException(e);
            res.statusCode = 500;
            return res.end(`Exception on ${componentName}. ${e}`);
        }
    });
});

function getComponentElement(componentName, data) {
    const componentPath = path.join(componentFolderPath, componentName);
    let component = require(componentPath);
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
  console.log(`Server running at http://${hostname}:${port}/\nBase components folder: ${componentFolderPath}`);
});

module.exports = { getComponentElement, renderServerComponent, renderStaticServerComponent }

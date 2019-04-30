#!/usr/bin/env node

const http = require('http');

const config = require('./config');
const stripDot = require('./utils').stripDotPrefix;
const snakeToCamelCase = require('./caseconverters').keysToCamelFromSnake;

const {
    renderStaticServerComponent,
    renderServerComponent
} = require('./render');

if(config.sentry) {
    try {
        const Raven = require('raven');
        Raven.config(config.sentry).install();
        console.log('Raven installed')
    } catch(e) {
        console.log('Raven is not installed', e);
        Raven = {};
        Raven.captureException = function(){};
    }
}

module.exports = class Hastur {
    createServer() {
        const { snakeToCamel, debug, sentry, stripDotPrefix } = {...config};
        this.server = http.createServer((req, res) => {
            let body = '';
            if (req.method === 'GET') {
                res.statusCode = 405;
                return res.end();
            }
            req.on('data', function (chunk) {
                body += chunk;
            });

            req.on('end', function () {
                if (!body) {
                    res.statusCode = 400;
                    return res.end('Missing body parameter');
                }

                const bodyJson = JSON.parse(body);

                if (!bodyJson) {
                    res.statusCode = 400;
                    return res.end('Body is not json serializable');
                }

                if (!bodyJson.componentName) {
                    res.statusCode = 400;
                    return res.end('Missing componentName');
                }
                
                const componentName = stripDotPrefix ? 
                    stripDot(bodyJson.componentName) :
                    bodyJson.componentName;

                const bodyProps = bodyJson.props || {};
                const props = snakeToCamel ? 
                    snakeToCamelCase(bodyProps) : 
                    bodyProps;

                try {
                    global['SSRContext'] = bodyJson.context;

                    const component = bodyJson.static ?
                        renderStaticServerComponent(componentName, props) : 
                        renderServerComponent(componentName, props);

                    if (debug) {
                        console.log(`Server rendering component: ${componentName}`)
                    }

                    delete global['SSRContext'];

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html; charset=utf-8;');
                    res.end(component);
                } catch (e) {
                    if (debug) {
                        console.error(e);
                    }

                    if (sentry) {
                        try {
                            Raven.captureException(e);
                        } catch (ex) {
                            console.error('Raven failed to log error:', ex)
                        }
                    }

                    res.statusCode = 500;
                    return res.end(`Exception on ${componentName}. ${e}`);
                }
            });
        });
    }

    listen() {
        const { port, host, debug, componentsPath, modulesPath } = {...config};
        
        this.server.listen(port, host, () => {
            

            if (debug) {
                console.log(`Debug mode is set to: ${!!debug}`);
            }

            console.log(`Server running at http://${host}:${port}/
Base components folder: ${componentsPath}
Node modules path: ${modulesPath}`);
        });
    }

    getServer() {
        this.createServer();
        return this.server;
    }

    start() {
        this.createServer()
        this.listen();
        
    }
}

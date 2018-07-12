const path = require('path');
const config = require('./config');

const React = require(path.join(config.modulesPath, 'react'));
const ReactDOMServer = require(path.join(config.modulesPath, 'react-dom/server'));

const requireUncached = require('./cache').requireUncached;

const getComponentElement = (componentName, data) => {
    const componentPath = path.posix.join(config.componentsPath, componentName);
    const component = config.debug ? 
        requireUncached(componentPath) :
        require(componentPath);
    const element = React.createElement(component.default, data);
    return element;
}

const renderStaticServerComponent = (componentName, data) => {
    let element = getComponentElement(componentName, data);
    let renderedComponent = ReactDOMServer.renderToStaticMarkup(element);
    return renderedComponent;
}

const renderServerComponent = (componentName, data) => {
    let element = getComponentElement(componentName, data);
    let renderedComponent = ReactDOMServer.renderToString(element);
    return renderedComponent;
}

module.exports = {
    getComponentElement,
    renderStaticServerComponent,
    renderServerComponent
}
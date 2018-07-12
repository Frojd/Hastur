const stripDotPrefix = (component) => {
    const componentNames = component.split('.');
    parsedComponentName = componentNames[componentNames.length-1];
    return parsedComponentName
}

module.exports = {
    stripDotPrefix
}
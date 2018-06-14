/* eslint-disable */
function purgeCache(moduleName, componentFolderPath) {
    Object.keys(require.cache).forEach(function(key) {
        if(key.indexOf(componentFolderPath) !== -1) {
            delete require.cache[key];
        }
    });
};
module.exports = {purgeCache};

/* eslint-enable no-undef, no-unused-vars */
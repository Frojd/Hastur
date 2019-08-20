const program = require('commander');

program
    .description('Starts hastur')
    .option('-h, --host <host>', 'Host')
    .option('-p, --port <port>', 'Port number')
    .option('-d, --debug', 'Debug')
    .option('-P, --path <path>', 'Path to components')
    .option('-m, --modulesPath <modulesPath>', 'Absolute path to node modules')
    .option('-s, --sentry <sentry>', 'Sentry')
    .option('-r, --stripDotPrefix', 'Strip prefix before ., ex Components. from Components.Hero')
    .option('-t, --toCamelFromSnake', 'Convert json to camelcase from snakecase')
    .parse(process.argv);

const env = process.env;

function toBool(str){
    return str && str.toLowerCase() === 'true' || str === '1'
}

module.exports = configuration = {
    port: program.port || env.HASTUR_PORT || 3000,
    host: program.host || env.HASTUR_HOST || '127.0.0.1',
    debug: program.debug || toBool(env.HASTUR_DEBUG) || false,
    sentry: program.sentry || env.HASTUR_SENTRY || false,
    snakeToCamel: program.toCamelFromSnake || toBool(env.HASTUR_JSON_SNAKE_TO_CAMEL) || false,
    stripDotPrefix: program.stripDotPrefix || toBool(env.HASTUR_STRIP_DOT_PREFIX) || false,
    componentsPath: program.path || env.HASTUR_PATH || './',
    modulesPath: program.modulesPath || env.HASTUR_MODULES_PATH || './'
}

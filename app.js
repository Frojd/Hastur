const Hastur = require('./src/hastur');
const configuration = require('./src/config');

const hastur = new Hastur(configuration);
hastur.start();

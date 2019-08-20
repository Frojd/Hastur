const configuration = require('./config');

describe('Configuration', function() {
    it('should return default port', () => {
        expect(configuration.port).toEqual(3000)
    })

    it('should return default host', function() {
        expect(configuration.host).toEqual('127.0.0.1');
    });

    it('should return default debug', function() {
        expect(configuration.debug).toEqual(false);
    });

    it('should return default sentry', function() {
        expect(configuration.sentry).toEqual(false);
    });

    it('should return default snakeToCamel', function() {
        expect(configuration.snakeToCamel).toEqual(false);
    });

    it('should return default stripDotPrefix', function() {
        expect(configuration.stripDotPrefix).toEqual(false);
    });

    it('should return default componentsPath', function() {
        expect(configuration.componentsPath).toEqual('./');
    });

    it('should return default modulesPath', function() {
        expect(configuration.modulesPath).toEqual('./');
    });
});

const stripDotPrefix = require('./utils').stripDotPrefix;

describe('Test utils', () => {
    it('Strips .prefix from string', () => {
        const input = 'Component.ComponentName';
        const expected = 'ComponentName';
        
        expect(stripDotPrefix(input)).toEqual(expected);
    })

    it('Should not break when no . found', () => {
        const input = 'ComponentName';
        const expected = 'ComponentName';
        
        expect(stripDotPrefix(input)).toEqual(expected);
    })
})
const {
    camelToSnake,
    snakeToCamel,
    snakeToPascal,
    keysToCamelFromSnake,
    keysToSnakeFromCamel,
} = require('./caseconverters');

describe('Coverters', () => {
    it('camelToSnake', () => {
        expect(camelToSnake('ett100EnkeltExempel700')).toBe('ett_100_enkelt_exempel_700');
    });

    it('snakeToCamel', () => {
        expect(snakeToCamel('max_700')).toBe('max700');
    });

    it('snakeToPascal', () => {
        expect(snakeToPascal('max_700')).toBe('Max700');
        expect(snakeToPascal('it_is_1_good')).toBe('ItIs1Good');
    });
});

describe('Key converters', () => {
    it('keysToCamelFromSnake oneLevel', () => {
        const original = {max_700: {a_ba_ca: 'a'}};
        const expected = {max700: {aBaCa: 'a'}};
        expect(JSON.stringify(keysToCamelFromSnake(original))).toBe(JSON.stringify(expected));
    });

    it('keysToCamelFromSnake twoLevel', () => {
        const original = {max_700: {a_ba_ca: {x_yz: 'asd'}}};
        const expected = {max700: {aBaCa: {xYz: 'asd'}}};
        expect(JSON.stringify(keysToCamelFromSnake(original))).toBe(JSON.stringify(expected));
    });

    it('keysToSnakeFromCamel oneLevel', () => {
        const original = {max700: {aBaCa: 'a'}};
        const expected = {max_700: {a_ba_ca: 'a'}};
        expect(JSON.stringify(keysToSnakeFromCamel(original))).toBe(JSON.stringify(expected));
    });

    it('keysToSnakeFromCamel twoLevel', () => {
        const original = {max700: {aBaCa: {xYz: 'asd'}}};
        const expected = {max_700: {a_ba_ca: {x_yz: 'asd'}}};
        expect(JSON.stringify(keysToSnakeFromCamel(original))).toBe(JSON.stringify(expected));
    });

});
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { capResults, filterOptions, fromSelect, areEqual, isPrintableKeyCode, uid, defaultSearch, resolveMsg } from '../../src/lib/utils.js';

const makeSelect = html => {
    const select = document.createElement('select');
    select.innerHTML = html;
    return select;
};

describe('Autocomplete > Utils > capResults', () => {

    it('should trim a result set to a positive maxResults', () => {
        assert.deepStrictEqual(capResults([1, 2, 3, 4, 5, 6, 7, 8], 6), [1, 2, 3, 4, 5, 6]);
    });

    it('should leave a result set shorter than the cap untouched', () => {
        assert.deepStrictEqual(capResults([1, 2, 3], 6), [1, 2, 3]);
    });

    it('should coerce a string cap (from a data-* attribute)', () => {
        assert.deepStrictEqual(capResults([1, 2, 3, 4], '2'), [1, 2]);
    });

    it('should treat 0 as no cap', () => {
        assert.deepStrictEqual(capResults([1, 2, 3, 4], 0), [1, 2, 3, 4]);
    });

    it('should treat a non-finite cap as no cap', () => {
        assert.deepStrictEqual(capResults([1, 2, 3, 4], Infinity), [1, 2, 3, 4]);
    });

    it('should treat a falsy cap as no cap', () => {
        assert.deepStrictEqual(capResults([1, 2, 3, 4], false), [1, 2, 3, 4]);
    });
});

describe('Autocomplete > Utils > filterOptions', () => {

    const options = [{ label: 'Apple' }, { label: 'Apricot' }, { label: 'Banana' }];
    const search = filterOptions(options, option => option.label);

    it('should match options whose display text contains the query', () => {
        assert.deepStrictEqual(search('ap'), [{ label: 'Apple' }, { label: 'Apricot' }]);
    });

    it('should match case-insensitively', () => {
        assert.deepStrictEqual(search('BAN'), [{ label: 'Banana' }]);
    });

    it('should return an empty array when nothing matches', () => {
        assert.deepStrictEqual(search('zz'), []);
    });
});

describe('Autocomplete > Utils > fromSelect', () => {

    it('should map non-placeholder options to { value, label } and read name/multiple', () => {
        const select = makeSelect('<option value="">Choose</option><option value="a">Apple</option><option value="b">Banana</option>');
        select.setAttribute('name', 'fruit');
        const result = fromSelect(select);

        assert.deepStrictEqual(result.options, [{ value: 'a', label: 'Apple' }, { value: 'b', label: 'Banana' }]);
        assert.strictEqual(result.name, 'fruit');
        assert.strictEqual(result.multiple, false);
    });

    it('should seed the selection from options carrying the selected attribute', () => {
        const select = makeSelect('<option value="a">Apple</option><option value="b" selected>Banana</option>');
        const result = fromSelect(select);
        assert.deepStrictEqual(result.selected, [{ value: 'b', label: 'Banana' }]);
    });

    it('should carry the multiple flag from a <select multiple>', () => {
        const select = makeSelect('<option value="a">Apple</option>');
        select.setAttribute('multiple', 'multiple');
        assert.strictEqual(fromSelect(select).multiple, true);
    });
});

describe('Autocomplete > Utils > areEqual', () => {

    it('should return true for arrays with equal contents', () => {
        assert.strictEqual(areEqual([{ a: 1 }], [{ a: 1 }]), true);
    });

    it('should return false for arrays of different length', () => {
        assert.strictEqual(areEqual([1], [1, 2]), false);
    });

    it('should return false for arrays with differing contents', () => {
        assert.strictEqual(areEqual([{ a: 1 }], [{ a: 2 }]), false);
    });
});

describe('Autocomplete > Utils > isPrintableKeyCode', () => {

    it('should be true for letters, numbers, space and backspace', () => {
        [65, 48, 32, 8].forEach(code => assert.strictEqual(isPrintableKeyCode(code), true));
    });

    it('should be false for navigation and control keys', () => {
        [9, 13, 27, 38, 40].forEach(code => assert.strictEqual(isPrintableKeyCode(code), false));
    });
});

describe('Autocomplete > Utils > uid', () => {

    it('should return prefixed, unique, incrementing ids', () => {
        const first = uid('autocomplete');
        const second = uid('autocomplete');
        assert.strictEqual(first.startsWith('autocomplete-'), true);
        assert.notStrictEqual(first, second);
    });
});

describe('Autocomplete > Utils > defaultSearch', () => {

    it('should filter a list of strings case-insensitively', () => {
        const search = defaultSearch(['Apple', 'Apricot', 'Banana']);
        assert.deepStrictEqual(search('AP'), ['Apple', 'Apricot']);
    });
});

describe('Autocomplete > Utils > resolveMsg', () => {

    it('should return a plain string message as-is', () => {
        assert.strictEqual(resolveMsg('Type more'), 'Type more');
    });

    it('should call a function message with the passed arguments', () => {
        assert.strictEqual(resolveMsg(n => `Type ${n} or more`, 3), 'Type 3 or more');
    });
});

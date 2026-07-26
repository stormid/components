import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { capResults, filterOptions, fromSelect, areEqual, isPrintableKeyCode, uid, fromValues, toValueArray, resolveMsg, escapeHtml, html } from '../../src/lib/utils.js';

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

    it('should skip disabled options so they are not offered as suggestions', () => {
        const select = makeSelect('<option value="a">Apple</option><option value="b" disabled>Banana</option>');
        assert.deepStrictEqual(fromSelect(select).options, [{ value: 'a', label: 'Apple' }]);
    });

    it('should read the live selected property, not just the attribute', () => {
        const select = makeSelect('<option value="a">Apple</option><option value="b">Banana</option>');
        select.options[1].selected = true; // set via property, no `selected` attribute
        assert.deepStrictEqual(fromSelect(select).selected, [{ value: 'b', label: 'Banana' }]);
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

describe('Autocomplete > Utils > fromValues', () => {

    it('should wrap plain strings into { value, label } options', () => {
        assert.deepStrictEqual(fromValues(['Apple', 'Banana']), [
            { value: 'Apple', label: 'Apple' },
            { value: 'Banana', label: 'Banana' }
        ]);
    });

    it('should pass option objects through unchanged', () => {
        const options = [{ value: 'a', label: 'Apple' }];
        assert.deepStrictEqual(fromValues(options), [{ value: 'a', label: 'Apple' }]);
    });
});

describe('Autocomplete > Utils > toValueArray', () => {

    it('should return an array source unchanged (init option arrays)', () => {
        const arr = ['GB', 'FR'];
        assert.strictEqual(toValueArray(arr), arr);
    });

    it('should parse a JSON-array string (server-rendered data-* attribute)', () => {
        assert.deepStrictEqual(toValueArray('["GB","FR"]'), ['GB', 'FR']);
    });

    it('should treat a plain string as a single value', () => {
        assert.deepStrictEqual(toValueArray('GB'), ['GB']);
    });

    it('should fall back to a single value when a bracketed string is not valid JSON', () => {
        assert.deepStrictEqual(toValueArray('[not json'), ['[not json']);
    });

    it('should coerce null/undefined to an empty array', () => {
        assert.deepStrictEqual(toValueArray(null), []);
        assert.deepStrictEqual(toValueArray(undefined), []);
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

describe('Autocomplete > Utils > escapeHtml', () => {

    it('should escape the HTML-significant characters', () => {
        assert.strictEqual(escapeHtml(`<a href="x">Tom & Jerry's</a>`), '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;');
    });

    it('should coerce null/undefined to an empty string', () => {
        assert.strictEqual(escapeHtml(null), '');
        assert.strictEqual(escapeHtml(undefined), '');
    });

    it('should neutralise a script tag so it renders as text, not markup', () => {
        const el = document.createElement('div');
        el.innerHTML = `<b>${escapeHtml('<script>alert(1)</script>')}</b>`;
        assert.strictEqual(el.querySelector('script'), null);
        assert.strictEqual(el.querySelector('b').textContent, '<script>alert(1)</script>');
    });
});

describe('Autocomplete > Utils > html', () => {

    it('should leave the static markup untouched and escape interpolated values', () => {
        assert.strictEqual(
            html`<span>${'Tom & Jerry'}</span>`,
            '<span>Tom &amp; Jerry</span>'
        );
    });

    it('should escape an interpolated value that carries markup so it renders as text', () => {
        const el = document.createElement('div');
        el.innerHTML = html`<b>${'<img src=x onerror=alert(1)>'}</b>`;
        assert.strictEqual(el.querySelector('img'), null);
        assert.strictEqual(el.querySelector('b').textContent, '<img src=x onerror=alert(1)>');
    });

    it('should handle a template with no interpolations', () => {
        assert.strictEqual(html`<hr>`, '<hr>');
    });
});

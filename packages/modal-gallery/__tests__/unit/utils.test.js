import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitize, escapeAttr } from '../../src/lib/utils.js';

describe('Modal Gallery > Utils > sanitize', () => {

    it('should replace ampersands with HTML entity', () => {
        assert.deepStrictEqual(sanitize('test&test&test&test'), 'test&amp;test&amp;test&amp;test');
    });

    it('should replace code block open braces with HTML entity less than', () => {
        assert.deepStrictEqual(sanitize('<test'), '&lt;test');
    });

    it('should replace code close open braces with HTML entity greater than', () => {
        assert.deepStrictEqual(sanitize('test>'), 'test&gt;');
    });

    it('should replace ampersands, open, and close blocks with non-JS executable HTML entities', () => {
        assert.deepStrictEqual(sanitize('<img src="x" onerror="alert(1)" >Image alert'), '&lt;img src="x" onerror="alert(1)" &gt;Image alert');
    });

});

describe('Modal Gallery > Utils > escapeAttr', () => {

    it('should encode double and single quotes so a value cannot break out of an attribute', () => {
        assert.deepStrictEqual(escapeAttr('" onerror="alert(1)'), '&quot; onerror=&quot;alert(1)');
        assert.deepStrictEqual(escapeAttr(`it's`), 'it&#39;s');
    });

    it('should also encode ampersands and angle brackets', () => {
        assert.deepStrictEqual(escapeAttr('<b>&"'), '&lt;b&gt;&amp;&quot;');
    });

    it('should coerce non-string values without throwing', () => {
        assert.deepStrictEqual(escapeAttr(null), 'null');
        assert.deepStrictEqual(escapeAttr(undefined), 'undefined');
    });

});

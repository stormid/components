import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { details, item } from '../../src/lib/defaults/templates.js';

describe('Modal Gallery > Templates > details', () => {

    it('should default the image title to an h2 heading', () => {
        assert.match(details({ title: 'Title', description: '' }), /<h2 class="modal-gallery__title">Title<\/h2>/);
    });

    it('should honour a configured heading level', () => {
        assert.match(details({ title: 'Title', description: '' }, 'h3'), /<h3 class="modal-gallery__title">Title<\/h3>/);
    });

    it('should fall back to h2 for an invalid heading level', () => {
        const html = details({ title: 'Title', description: '' }, 'script');
        assert.match(html, /<h2 class="modal-gallery__title">/);
        assert.doesNotMatch(html, /<script/);
    });

    it('should return an empty string when there is no title or description', () => {
        assert.strictEqual(details({ title: '', description: '' }), '');
    });

});

describe('Modal Gallery > Templates > item', () => {

    it('should escape the title in the slide aria-label so it cannot break out of the attribute', () => {
        const html = item([{ title: '" onclick="x' }])('', 0);
        assert.match(html, /aria-label="Image 1 of 1, &quot; onclick=&quot;x"/);
        assert.doesNotMatch(html, /onclick="x"/);
    });

});

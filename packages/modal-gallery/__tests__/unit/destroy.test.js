import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import modalGallery from '../../src/index.js';

const markup = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1">
    <img src="https://placehold.co/200x200" alt="">
</a>`;

describe('Modal Gallery > API > destroy', () => {

    it('should expose a destroy method', () => {
        document.body.innerHTML = markup;
        const gallery = modalGallery('.js-modal-gallery');
        assert.strictEqual(typeof gallery.destroy, 'function');
    });

    it('should close an open gallery, remove the overlay, and detach trigger listeners', () => {
        document.body.innerHTML = markup;
        const gallery = modalGallery('.js-modal-gallery');
        const trigger = gallery.getState().items[0].trigger;

        //open via the trigger
        trigger.click();
        assert.strictEqual(gallery.getState().isOpen, true);

        gallery.destroy();

        //closed and overlay removed from the DOM
        assert.strictEqual(gallery.getState().isOpen, false);
        assert.strictEqual(document.querySelector('.js-modal-gallery__inner'), null);

        //trigger listener detached: clicking again does not reopen
        trigger.click();
        assert.strictEqual(gallery.getState().isOpen, false);
    });

});

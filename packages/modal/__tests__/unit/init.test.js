import { describe, it, before, mock } from 'node:test';
import assert from 'node:assert/strict';
import modal from '../../src/index.js';
import { getSelection } from '../../src/lib/utils.js';

let ModalSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<button class="js-modal-toggle" data-id="toggle-1">Open modal</button>
    <div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
        <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
            <h1 id="modal-label">Modal</h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
            <button aria-label="close" class="modal__close-btn js-modal-toggle" data-id="toggle-2">
                <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </button>
        </div>
    </div>

    <button class="js-modal-toggle__2">Open modal</button>
    <div id="modal-2" class="js-modal modal" data-delay="20" data-modal-toggle="js-modal-toggle__2">
        <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label-2">
            <h1 id="modal-label-2">Modal two</h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
             <button aria-label="close" class="modal__close-btn js-modal-toggle-2">
                <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </button>
        </div>
    </div>

    <div id="modal-3" class="js-modal__dialogless modal" data-delay="20" data-modal-toggle="js-modal-toggle__3">
        <div class="modal__inner">
            <h1 id="modal-label-2">Modal three</h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
        </div>
    </div>

    <button class="js-modal-toggle__4">Open modal</button>
    <div id="modal-4" class="js-modal__unlabelled modal" data-modal-toggle="js-modal-toggle__4">
        <div class="modal__inner" role="dialog" aria-modal="true">
            <div class="modal__inner">
                <h1>Modal four</h1>
                <button>Focusable element</button>
                <input type="text">
                <input type="text">
            </div>
        </div>
    </div>

    <button class="js-modal-toggle__4">Open modal</button>
    <div id="modal-5" class="js-modal__undescribed modal" data-modal-toggle="js-modal-toggle__4">
        <div class="modal__inner" role="alertdialog" aria-modal="true" aria-label="Test modal">
            <div class="modal__inner">
                <h1>Modal four</h1>
                <button>Focusable element</button>
                <input type="text">
                <input type="text">
            </div>
        </div>
    </div>`;

    ModalSet = modal('.js-modal');

};


describe(`Modal > Initialisation`, () => {

    before(init);

    it('should initialise multiple modals and return an Array of instances', async () => {
        assert.deepStrictEqual(ModalSet.length, 2);
    });

    it('should return the expected API', () => {
        assert.notStrictEqual(ModalSet[0], null);
        assert.notStrictEqual(ModalSet[0].getState, null);
    });

    it('should return an empty array without throwing, and a console warning, if no DOM nodes are found', () => {
        const warn = mock.method(console, 'warn', () => {});
        assert.deepStrictEqual(modal('.js-not-found'), []);
        assert.ok(warn.mock.calls.some(call => {
            try {
                assert.deepStrictEqual(call.arguments, [`Modal not initialised, no elements found for selector '.js-not-found'`]);
                return true;
            } catch {
                return false;
            }
        }));
        warn.mock.restore();
    });

    it('should return without throwing and a console warning if no dialog is found', () => {
        const warn = mock.method(console, 'warn', () => {});
        modal('.js-modal__unlabelled');
        assert.ok(warn.mock.calls.some(call => {
            try {
                assert.deepStrictEqual(call.arguments, ['The modal dialog should have an aria-labelledby attribute that matches the id of an element that contains text, or an aria-label attribute.']);
                return true;
            } catch {
                return false;
            }
        }));
        warn.mock.restore();
    });

    it('should console.warn if an alertdialog does not have a description linked with an aria-describedby attribute', () => {
        const warn = mock.method(console, 'warn', () => {});
        modal('.js-modal__undescribed');
        assert.ok(warn.mock.calls.some(call => {
            try {
                assert.deepStrictEqual(call.arguments, ['The alertdialog should have an aria-describedby attribute that matches the id of an element that contains text']);
                return true;
            } catch {
                return false;
            }
        }));
        warn.mock.restore();
    });

    it('should create instance with different options based on node data-attributes from same init function', () => {
        assert.notDeepStrictEqual(ModalSet[0].getState().settings.delay, ModalSet[1].getState().settings.delay);
    });

    it('should find toggles associated with the modal', () => {
        const [ modal ] = ModalSet;
        const { toggles } = modal.getState();
        assert.deepStrictEqual(toggles.length, 2);
        assert.deepStrictEqual(toggles[0].getAttribute('data-id'), 'toggle-1');
        assert.deepStrictEqual(toggles[1].getAttribute('data-id'), 'toggle-2');
    });

});


describe('Modal > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
            <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
                <h1 id="modal-label">Modal</h1>
                <button>Focusable element</button>
                <input type="text">
                <input type="text">
                <button aria-label="close" class="modal__close-btn js-modal-toggle" data-id="toggle-2">
                    <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                </button>
            </div>
        </div>`;
    }

    before(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const modal = document.querySelector('.js-modal');
        const els = getSelection(modal);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const modal = document.querySelectorAll('.js-modal');
        const els = getSelection(modal);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const modal = document.querySelector('.js-modal');
        const els = getSelection([modal]);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-modal');
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

});


describe('Modal > Initialisation > Start open', () => {

    it('should start open based on initialisation option', async () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
            <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
                <h1 id="modal-label">Modal</h1>
                <button>Focusable element</button>
                <input type="text">
                <input type="text">
                <button aria-label="close" class="modal__close-btn js-modal-toggle" data-id="toggle-2">
                    <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                </button>
            </div>
        </div>`;

        const [ instance ] = modal('.js-modal', { startOpen: true });
        assert.strictEqual(instance.getState().isOpen, true);
    });

    it('should start open based on data-attribute', async () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle" data-start-open="true">
            <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
                <h1 id="modal-label">Modal</h1>
                <button>Focusable element</button>
                <input type="text">
                <input type="text">
                <button aria-label="close" class="modal__close-btn js-modal-toggle" data-id="toggle-2">
                    <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                </button>
            </div>
        </div>`;

        const [ instance ] = modal('.js-modal');
        assert.strictEqual(instance.getState().isOpen, true);
    });

    it('should NOT start open when data-start-open is the string "false"', () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle" data-start-open="false">
            <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label"><h1 id="modal-label">Modal</h1><button>Focusable element</button></div>
        </div>`;

        const [ instance ] = modal('.js-modal');
        assert.strictEqual(instance.getState().isOpen, false);
    });

    it('should coerce a data-delay string into a number', () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle" data-delay="20">
            <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label"><h1 id="modal-label">Modal</h1><button>Focusable element</button></div>
        </div>`;

        const [ instance ] = modal('.js-modal');
        assert.strictEqual(instance.getState().settings.delay, 20);
    });

});


describe('Modal > Initialisation > Dialog attributes', () => {

    it('should set aria-modal and a fallback tabindex on the dialog', () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
            <div class="modal__inner" role="dialog" aria-labelledby="modal-label"><h1 id="modal-label">Modal</h1><button>Focusable element</button></div>
        </div>`;

        modal('.js-modal');
        const dialog = document.querySelector('.modal__inner');
        assert.strictEqual(dialog.getAttribute('aria-modal'), 'true');
        assert.strictEqual(dialog.getAttribute('tabindex'), '-1');
    });

});


describe('Modal > Behaviour > DOM position', () => {

    it('should move the node to the top of the body on open and restore its original position on close', () => {
        document.body.innerHTML = `<div class="wrapper">
            <button class="js-modal-toggle">Open modal</button>
            <div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
                <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label"><h1 id="modal-label">Modal</h1><button>Focusable element</button></div>
            </div>
            <p id="after">after</p>
        </div>`;

        const node = document.querySelector('#modal-1');
        const originalParent = node.parentNode;
        const [ instance ] = modal('.js-modal');

        instance.open();
        assert.strictEqual(document.body.firstElementChild, node);

        instance.close();
        assert.strictEqual(node.parentNode, originalParent);
        assert.strictEqual(node.nextElementSibling.id, 'after');
    });

});


describe('Modal > API > destroy', () => {

    it('should close the modal and detach toggles so they no longer open it', () => {
        document.body.innerHTML = `<button class="js-modal-toggle">Open modal</button>
            <div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
                <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label"><h1 id="modal-label">Modal</h1><button>Focusable element</button></div>
            </div>`;

        const [ instance ] = modal('.js-modal');
        const toggle = document.querySelector('.js-modal-toggle');

        toggle.click();
        assert.strictEqual(instance.getState().isOpen, true);

        instance.destroy();
        assert.strictEqual(instance.getState().isOpen, false);

        toggle.click();
        assert.strictEqual(instance.getState().isOpen, false);
    });

});

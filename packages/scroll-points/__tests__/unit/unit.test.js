import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import factory, { callback } from '../../src/lib/factory.js';
import defaults from '../../src/lib/defaults.js';

describe('Scroll points > unit > callback', () => {

    it('should do nothing if the entry is not intersecting', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: false }];
        const observer = { unobserve: () => {} };
        callback({ settings, node })(entries, observer);

        assert.deepStrictEqual(node.classList.contains(defaults.className), false);
    });

    it('should change className if entries[0] is intersecting', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: true }];
        const observer = { unobserve: () => {} };
        callback({ settings, node })(entries, observer);

        assert.deepStrictEqual(node.classList.contains(defaults.className), true);
    });

    it('should invoke callback with the entry and context if intersecting and settings.callback defined', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const mockCallback = mock.fn();
        const node = document.querySelector('.test');
        const settings = Object.assign({}, defaults, { callback: mockCallback });
        const entry = { isIntersecting: true };
        const observer = { unobserve: () => {} };
        callback({ settings, node })([entry], observer);

        assert.strictEqual(mockCallback.mock.callCount(), 1);
        const args = mockCallback.mock.calls[0].arguments;
        assert.strictEqual(args[0], entry);
        assert.strictEqual(args[1].node, node);
        assert.strictEqual(args[1].settings, settings);
        assert.strictEqual(args[1].observer, observer);
    });

    it('should invoke unobserve with the node if intersecting and settings.unload truthy', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const mockUnobserve = mock.fn();
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: true }];
        const observer = { unobserve: mockUnobserve };
        callback({ settings, node })(entries, observer);

        assert.strictEqual(mockUnobserve.mock.callCount(), 1);
        assert.deepStrictEqual(mockUnobserve.mock.calls[0].arguments, [node]);
    });

    it('should not unobserve when replay is set, even if unload is truthy', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const mockUnobserve = mock.fn();
        const node = document.querySelector('.test');
        const settings = { ...defaults, replay: true, unload: true };
        const observer = { unobserve: mockUnobserve };
        callback({ settings, node })([{ isIntersecting: true }], observer);

        assert.strictEqual(mockUnobserve.mock.callCount(), 0);
    });

    it('should remove className if entries[0] is not intersecting and replay and unload options set to allow replaying', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = { ...defaults, replay: true, unload: false };
        const observer = { unobserve: () => {} };
        callback({ settings, node })([{ isIntersecting: true }], observer);
        assert.deepStrictEqual(node.classList.contains(defaults.className), true);

        callback({ settings, node })([{ isIntersecting: false }], observer);
        assert.deepStrictEqual(node.classList.contains(defaults.className), false);
    });

});

describe('Scroll points > unit > factory', () => {

    it('should expose a destroy method that disconnects the observer and removes the className', () => {
        const mockDisconnect = mock.fn();
        globalThis.IntersectionObserver = mock.fn(function () {
            this.observe = () => {};
            this.unobserve = () => {};
            this.disconnect = mockDisconnect;
        });
        document.body.innerHTML = '<div class="test on"></div>';
        const node = document.querySelector('.test');

        const instance = factory({ settings: { ...defaults, className: 'on' }, node });

        assert.strictEqual(typeof instance.destroy, 'function');
        instance.destroy();
        assert.strictEqual(mockDisconnect.mock.callCount(), 1);
        assert.strictEqual(node.classList.contains('on'), false);
    });

});

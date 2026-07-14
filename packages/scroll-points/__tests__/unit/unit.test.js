import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { callback } from '../../src/lib/factory.js';
import defaults from '../../src/lib/defaults.js';

describe('Scroll points > unit > callback', () => {

    it('should do nothing if the entry is not intersecting', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: false }];
        const observer = { disconnect: () => {} };
        callback({ settings, node })(entries, observer);

        assert.deepStrictEqual(node.classList.contains(defaults.className), false);
    });

    it('should change className if entries[0] is intersecting', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: () => {} };
        callback({ settings, node })(entries, observer);

        assert.deepStrictEqual(node.classList.contains(defaults.className), true);
    });

    it('should invoke callback if intersecting and settings.callback defined', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const mockCallback = mock.fn();
        const node = document.querySelector('.test');
        const settings = Object.assign({}, defaults, { callback: mockCallback });
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: () => {} };
        callback({ settings, node })(entries, observer);

        assert.ok(mockCallback.mock.callCount() > 0);
    });

    it('should invoke disconnect if intersecting and settings.unload truthy', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const mockDisconnect = mock.fn();
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: mockDisconnect };
        callback({ settings, node })(entries, observer);

        assert.ok(mockDisconnect.mock.calls.some(c => { try { assert.deepStrictEqual(c.arguments, [node]); return true; } catch { return false; } }));
    });

    it('should remove className if entries[0] is not intersecting and replay and unload options set to allow replaying', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = { ...defaults, replay: true, unload: false };
        const observer = { disconnect: () => {} };
        callback({ settings, node })([{ isIntersecting: true }], observer);
        assert.deepStrictEqual(node.classList.contains(defaults.className), true);

        callback({ settings, node })([{ isIntersecting: false }], observer);
        assert.deepStrictEqual(node.classList.contains(defaults.className), false);
    });


});

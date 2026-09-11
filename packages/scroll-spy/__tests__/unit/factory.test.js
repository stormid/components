import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import factory, { scrollCallback } from '../../src/lib/factory.js';
import defaults from '../../src/lib/defaults.js';
import { createStore } from '../../src/lib/store.js';

const mockScrollMetrics = ({ scrollHeight, clientHeight, scrollTop }) => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, get: () => scrollHeight });
    Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, get: () => clientHeight });
    Object.defineProperty(document.documentElement, 'scrollTop', { configurable: true, get: () => scrollTop });
};

describe('Scroll spy > factory > destroy', () => {

    it('should disconnect every observer, remove the scroll listener and clear active state', () => {
        const observe = mock.fn();
        const disconnect = mock.fn();
        globalThis.IntersectionObserver = mock.fn(function() {
            this.observe = observe;
            this.disconnect = disconnect;
        });
        window.IntersectionObserver = globalThis.IntersectionObserver;
        const removeListener = mock.method(window, 'removeEventListener');

        document.body.innerHTML = `
            <a class="link ${defaults.activeClassName}" href="#s1" aria-current="true">1</a>
            <a class="link" href="#s2">2</a>
            <section id="s1"></section>
            <section id="s2"></section>`;
        const node1 = document.querySelector('.link');
        const nodes = [].slice.call(document.querySelectorAll('.link'));

        const instance = factory({ settings: { ...defaults }, nodes });
        assert.strictEqual(observe.mock.callCount(), 2);

        instance.destroy();

        assert.strictEqual(disconnect.mock.callCount(), 2);
        assert.ok(removeListener.mock.calls.some(call => call.arguments[0] === 'scroll'));
        assert.strictEqual(node1.classList.contains(defaults.activeClassName), false);
        assert.strictEqual(node1.hasAttribute('aria-current'), false);

        removeListener.mock.restore();
    });

});

describe('Scroll spy > factory > scrollCallback', () => {

    it('should flag hasScrolledToBottom true when the document is scrolled to the bottom', () => {
        const store = createStore();
        store.update({ spies: [], settings: defaults, active: [], hasScrolledToBottom: false });
        mockScrollMetrics({ scrollHeight: 1000, clientHeight: 400, scrollTop: 600 });
        scrollCallback(store)();
        assert.strictEqual(store.getState().hasScrolledToBottom, true);
    });

    it('should flag hasScrolledToBottom false when the document is not at the bottom', () => {
        const store = createStore();
        store.update({ spies: [], settings: defaults, active: [], hasScrolledToBottom: true });
        mockScrollMetrics({ scrollHeight: 1000, clientHeight: 400, scrollTop: 100 });
        scrollCallback(store)();
        assert.strictEqual(store.getState().hasScrolledToBottom, false);
    });

});

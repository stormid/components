import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { findSpies, setActive } from '../../src/lib/dom.js';
import { createStore } from '../../src/lib/store.js';
import defaults from '../../src/lib/defaults.js';
import { EVENTS } from '../../src/lib/constants.js';

describe('Scroll spy > dom > findSpies', () => {

    it('should build a { node, target } spy for each node whose hash resolves to an element', () => {
        document.body.innerHTML = `
            <a class="link" href="#section1">1</a>
            <a class="link" href="#section2">2</a>
            <section id="section1"></section>
            <section id="section2"></section>`;
        const nodes = [].slice.call(document.querySelectorAll('.link'));
        const spies = findSpies(nodes);
        assert.strictEqual(spies.length, 2);
        assert.strictEqual(spies[0].node, nodes[0]);
        assert.strictEqual(spies[0].target, document.getElementById('section1'));
    });

    it('should skip and warn for nodes with no hash or an unresolvable target, leaving no undefined holes', () => {
        document.body.innerHTML = `
            <a class="link" href="#section1">1</a>
            <a class="link" href="no-hash">2</a>
            <a class="link" href="#missing">3</a>
            <section id="section1"></section>`;
        const warn = mock.method(console, 'warn', () => {});
        const nodes = [].slice.call(document.querySelectorAll('.link'));
        const spies = findSpies(nodes);
        assert.strictEqual(spies.length, 1);
        assert.ok(spies.every(Boolean));
        assert.strictEqual(warn.mock.callCount(), 2);
        warn.mock.restore();
    });

    it('should resolve a hash that is a valid id but not a valid CSS selector, without throwing', () => {
        document.body.innerHTML = `<a class="link" href="#1abc">1</a><section id="1abc"></section>`;
        const nodes = [].slice.call(document.querySelectorAll('.link'));
        let spies;
        assert.doesNotThrow(() => { spies = findSpies(nodes); });
        assert.strictEqual(spies.length, 1);
        assert.strictEqual(spies[0].target, document.getElementById('1abc'));
    });

});

describe('Scroll spy > dom > setActive', () => {

    const setup = () => {
        document.body.innerHTML = `<a class="s1"></a><a class="s2"></a>`;
        const node = document.querySelector('.s1');
        const node2 = document.querySelector('.s2');
        const spy = { node, target: { offsetTop: 0 } };
        const spy2 = { node: node2, target: { offsetTop: 100 } };
        const store = createStore();
        store.update({ spies: [spy, spy2], settings: defaults, active: [], hasScrolledToBottom: false });
        return { store, node, node2, spy, spy2 };
    };

    it('should add the active class and aria-current to active nodes and clear them from inactive nodes', () => {
        const { store, node, node2, spy } = setup();
        store.update({ ...store.getState(), active: [spy] }, [ setActive(store) ]);
        assert.strictEqual(node.classList.contains(defaults.activeClassName), true);
        assert.strictEqual(node.getAttribute('aria-current'), 'true');
        assert.strictEqual(node2.classList.contains(defaults.activeClassName), false);
        assert.strictEqual(node2.hasAttribute('aria-current'), false);
    });

    it('should broadcast scroll-spy.active on activation and scroll-spy.inactive when a node leaves', () => {
        const { store, spy } = setup();
        const active = mock.fn();
        const inactive = mock.fn();
        document.addEventListener(EVENTS.ACTIVE, active);
        document.addEventListener(EVENTS.INACTIVE, inactive);

        store.update({ ...store.getState(), active: [spy] }, [ setActive(store) ]);
        assert.strictEqual(active.mock.callCount(), 1);
        assert.strictEqual(inactive.mock.callCount(), 0);

        store.update({ ...store.getState(), active: [] }, [ setActive(store) ]);
        assert.strictEqual(inactive.mock.callCount(), 1);

        document.removeEventListener(EVENTS.ACTIVE, active);
        document.removeEventListener(EVENTS.INACTIVE, inactive);
    });

    it('should expose getState and the changed node/target on the event detail', () => {
        const { store, node, spy } = setup();
        let detail;
        const handler = e => { detail = e.detail; };
        document.addEventListener(EVENTS.ACTIVE, handler);
        store.update({ ...store.getState(), active: [spy] }, [ setActive(store) ]);
        assert.strictEqual(typeof detail.getState, 'function');
        assert.strictEqual(detail.node, node);
        assert.strictEqual(detail.target, spy.target);
        document.removeEventListener(EVENTS.ACTIVE, handler);
    });

    it('should not re-broadcast when the active state is unchanged', () => {
        const { store, spy } = setup();
        const active = mock.fn();
        document.addEventListener(EVENTS.ACTIVE, active);
        store.update({ ...store.getState(), active: [spy] }, [ setActive(store) ]);
        store.update({ ...store.getState(), active: [spy] }, [ setActive(store) ]);
        assert.strictEqual(active.mock.callCount(), 1);
        document.removeEventListener(EVENTS.ACTIVE, active);
    });

});

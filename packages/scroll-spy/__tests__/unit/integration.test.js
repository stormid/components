import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { intersectionCallback } from '../../src/lib/factory.js';
import defaults from '../../src/lib/defaults.js';
import { createStore } from '../../src/lib/store.js';

describe('Scroll spy > factory > callback', () => {

    it('should update new state to the store', () => {
        const spy = { node: 'node-1', target: 'target-1' };
        const spy2 = { node: 'node-2', target: 'target-2' };
        const updateMock = mock.fn();
        const storeMock = {
            getState() { return this.state; },
            state: {
                settings: defaults,
                active: [spy],
                hasScrolledToBottom: false
            },
            update: updateMock
        };
        const entries = [{ isIntersecting: true }];
        intersectionCallback(storeMock, spy2)(entries);
        assert.ok(updateMock.mock.callCount() > 0);
    });

    it('should add a spy to the active array', () => {
        document.body.innerHTML = '<div class="node"></div>';
        const node = document.querySelector('.node');
        const spy = { node, target: 'target-1' };
        const Store = createStore();
        Store.update({ spies: [spy], settings: defaults, active: [], hasScrolledToBottom: false });
        const entries = [{ isIntersecting: true }];
        intersectionCallback(Store, spy)(entries);
        assert.deepStrictEqual(Store.getState().active, [spy]);
        assert.deepStrictEqual(node.classList.contains(defaults.activeClassName), true);
    });

    it('should add a spy to the active array and remove active className from currently active if settings.single', () => {
        document.body.innerHTML = `<div class="node ${defaults.activeClassName}"></div><div class="node-2"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy], settings: defaults, active: [spy], hasScrolledToBottom: false });
        const entries = [{ isIntersecting: true }];
        intersectionCallback(Store, spy2)(entries);
        assert.deepStrictEqual(Store.getState().active, [spy, spy2]);
        assert.deepStrictEqual(node.classList.contains(defaults.activeClassName), true);
        assert.deepStrictEqual(node2.classList.contains(defaults.activeClassName), false);
    });

    it('should add a spy to the active array and add className to spy node, preserving currently active if !settings.single', () => {
        document.body.innerHTML = `<div class="node ${defaults.activeClassName}"></div><div class="node-2"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy], settings: Object.assign({}, defaults, { single: false }), active: [spy], hasScrolled: false });
        const entries = [{ isIntersecting: true }];
        intersectionCallback(Store, spy2)(entries);
        assert.deepStrictEqual(Store.getState().active, [spy, spy2]);
        assert.deepStrictEqual(node.classList.contains(defaults.activeClassName), true);
        assert.deepStrictEqual(node2.classList.contains(defaults.activeClassName), true);
    });

    it('should remove a spy from the active array', () => {
        document.body.innerHTML = `<div class="node  ${defaults.activeClassName}"></div>`;
        const node = document.querySelector('.node');
        const spy = { node, target: 'target-1' };
        const Store = createStore();
        Store.update({ spies: [spy], settings: defaults, active: [spy], hasScrolledToBottom: false });
        const entries = [{ isIntersecting: false }];
        intersectionCallback(Store, spy)(entries);
        assert.deepStrictEqual(Store.getState().active, []);
        assert.deepStrictEqual(node.classList.contains(defaults.activeClassName), false);
    });

    it('should remove a spy from the active array, remove active className from currently active if settings.single, and reassign it to the top-most node', () => {
        document.body.innerHTML = `<div class="node"></div><div class="node-2 ${defaults.activeClassName}"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy, spy2], settings: defaults, active: [spy], hasScrolledToBottom: false });
        const entries = [{ isIntersecting: true }];
        intersectionCallback(Store, spy2)(entries);
        assert.deepStrictEqual(Store.getState().active, [spy, spy2]);
        assert.deepStrictEqual(node.classList.contains(defaults.activeClassName), true);
        assert.deepStrictEqual(node2.classList.contains(defaults.activeClassName), false);
    });

    it('should remove a spy from the active array, remove active className from currently active if settings.single, and the user has scrolled to the bottom', () => {
        document.body.innerHTML = `<div class="node"></div><div class="node-2 ${defaults.activeClassName}"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy, spy2], settings: defaults, active: [spy], hasScrolledToBottom: true });
        const entries = [{ isIntersecting: true }];
        intersectionCallback(Store, spy2)(entries);
        assert.deepStrictEqual(Store.getState().active, [spy, spy2]);
        assert.deepStrictEqual(node.classList.contains(defaults.activeClassName), false);
        assert.deepStrictEqual(node2.classList.contains(defaults.activeClassName), true);
    });

    it('should remove a spy from the active array, remove active className from currently active if settings.single', () => {
        document.body.innerHTML = `<div class="node ${defaults.activeClassName}"></div><div class="node-2 ${defaults.activeClassName}"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy, spy2], settings: Object.assign({}, defaults, { single: false }), defaults, active: [spy, spy2], hasScrolledToBottom: false });
        const entries = [{ isIntersecting: false}];
        intersectionCallback(Store, spy2)(entries);
        assert.deepStrictEqual(Store.getState().active, [spy]);
        assert.deepStrictEqual(node.classList.contains(defaults.activeClassName), true);
        assert.deepStrictEqual(node2.classList.contains(defaults.activeClassName), false);
    });

});

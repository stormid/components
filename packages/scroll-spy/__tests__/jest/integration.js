import { callback } from '../../src/lib/factory';
import defaults from '../../src/lib/defaults';
import { createStore } from '../../src/lib/store';

describe('Scroll spy > factory > callback', () => {

    it('should do nothing if the entry is not intersecting and there are no active items in state', () => {
        const state = {
            settings: defaults,
            active: []
        };
        const updateMock = jest.fn();
        const storeMock = {
            getState() { return state; },
            update: updateMock
        };
        const spy = { node: {}, target: {} };
        const entries = [{ isIntersecting: false }];
        const observer = { disconnect: () => {} };
        callback(storeMock, spy)(entries, observer);
        expect(updateMock).not.toBeCalled();
        expect(storeMock.getState()).toEqual(state);
    });

    it('should update new state to the store', () => {
        const spy = { node: 'node-1', target: 'target-1' };
        const spy2 = { node: 'node-2', target: 'target-2' };
        const updateMock = jest.fn();
        const storeMock = {
            getState() { return this.state; },
            state: {
                settings: defaults,
                active: [spy]
            },
            update: updateMock
        };
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: () => {} };
        callback(storeMock, spy2)(entries, observer);
        expect(updateMock).toBeCalled();
    });

    it('should add a spy to the active array', () => {
        document.body.innerHTML = '<div class="node"></div>';
        const node = document.querySelector('.node');
        const spy = { node, target: 'target-1' };
        const Store = createStore();
        Store.update({ spies: [spy], settings: defaults, active: [] });
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: () => {} };
        callback(Store, spy)(entries, observer);
        expect(Store.getState().active).toEqual([spy]);
        expect(node.classList.contains(defaults.activeClassName)).toEqual(true);
    });

    it('should add a spy to the active array and remove active className from currently active if settings.single', () => {
        document.body.innerHTML = `<div class="node ${defaults.activeClassName}"></div><div class="node-2"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy], settings: defaults, active: [spy] });
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: () => {} };
        callback(Store, spy2)(entries, observer);
        expect(Store.getState().active).toEqual([spy, spy2]);
        expect(node.classList.contains(defaults.activeClassName)).toEqual(false);
        expect(node2.classList.contains(defaults.activeClassName)).toEqual(true);
    });

    it('should add a spy to the active array and add className to spy node, preserving currently active if !settings.single', () => {
        document.body.innerHTML = `<div class="node ${defaults.activeClassName}"></div><div class="node-2"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy], settings: Object.assign({}, defaults, { single: false }), active: [spy] });
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: () => {} };
        callback(Store, spy2)(entries, observer);
        expect(Store.getState().active).toEqual([spy, spy2]);
        expect(node.classList.contains(defaults.activeClassName)).toEqual(true);
        expect(node2.classList.contains(defaults.activeClassName)).toEqual(true);
    });

    it('should remove a spy from the active array', () => {
        document.body.innerHTML = `<div class="node  ${defaults.activeClassName}"></div>`;
        const node = document.querySelector('.node');
        const spy = { node, target: 'target-1' };
        const Store = createStore();
        Store.update({ spies: [spy], settings: defaults, active: [spy] });
        const entries = [{ isIntersecting: false }];
        const observer = { disconnect: () => {} };
        callback(Store, spy)(entries, observer);
        expect(Store.getState().active).toEqual([]);
        expect(node.classList.contains(defaults.activeClassName)).toEqual(false);
    });

    it('should remove a spy from the active array, remove active className from currently active if settings.single, and reassign it to any remaining active spies', () => {
        document.body.innerHTML = `<div class="node"></div><div class="node-2 ${defaults.activeClassName}"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy, spy2], settings: defaults, active: [spy, spy2] });
        const entries = [{ isIntersecting: false }];
        const observer = { disconnect: () => {} };
        callback(Store, spy2)(entries, observer);
        expect(Store.getState().active).toEqual([spy]);
        expect(node.classList.contains(defaults.activeClassName)).toEqual(true);
        expect(node2.classList.contains(defaults.activeClassName)).toEqual(false);
    });

    it('should remove a spy from the active array, remove active className from currently active if settings.single', () => {
        document.body.innerHTML = `<div class="node ${defaults.activeClassName}"></div><div class="node-2 ${defaults.activeClassName}"></div>`;
        const node = document.querySelector('.node');
        const node2 = document.querySelector('.node-2');
        const spy = { node, target: 'target-1' };
        const spy2 = { node: node2, target: 'target-2' };
        const Store = createStore();
        Store.update({ spies: [spy, spy2], settings: Object.assign({}, defaults, { single: false }), defaults, active: [spy, spy2] });
        const entries = [{ isIntersecting: false }];
        const observer = { disconnect: () => {} };
        callback(Store, spy2)(entries, observer);
        expect(Store.getState().active).toEqual([spy]);
        expect(node.classList.contains(defaults.activeClassName)).toEqual(true);
        expect(node2.classList.contains(defaults.activeClassName)).toEqual(false);
    });

});
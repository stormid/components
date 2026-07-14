import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { addActive, removeActive } from '../../src/lib/reducers.js';

describe(`Scroll spy > reducers > addActive`, () => {

    it('should add a spy to the state active array', () => {
        const newSpy = { node: 'testNode', target: 'testTarget' };
        const state = {
            active: [{ node: {}, target: {} }]
        };
        assert.deepStrictEqual(addActive(state, newSpy), {
            active: [
                { node: {}, target: {} },
                newSpy
            ]
        });
    });

    it('should return the state array intact if the spy is already included in the state active array', () => {
        const newSpy = { node: 'testNode', target: 'testTarget' };
        const state = {
            active: [{ node: {}, target: {} }, newSpy],
        };
        assert.deepStrictEqual(addActive(state, newSpy), state);
    });

});

describe(`Scroll spy > reducers > removeActive`, () => {

    it('should remove a spy from the active array', () => {
        const spy = { node: 'testNode', target: 'testTarget' };
        const state = {
            active: [{ node: {}, target: {} }, spy]
        };
        assert.deepStrictEqual(removeActive(state, spy), {
            active: [
                { node: {}, target: {} }
            ]
        });
    });

    it('should return the state array intact if the spy is missing from the state active array', () => {
        const newSpy = { node: 'testNode', target: 'testTarget' };
        const state = {
            active: [{ node: {}, target: {} }]
        };
        assert.deepStrictEqual(removeActive(state, newSpy), state);
    });

});

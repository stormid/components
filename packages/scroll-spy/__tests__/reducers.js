import { addActive, removeActive, setDirection } from '../src/lib/reducers';

describe(`Scroll spy > reducers > addActive`, () => {

    it('should add a spy to the state active array', () => {
        const newSpy = { node: 'testNode', target: 'testTarget' };
        const state = {
            active: [{ node: {}, target: {} }]
        };
        expect(addActive(state, newSpy)).toEqual({
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
        expect(addActive(state, newSpy)).toEqual(state);
    });

});

describe(`Scroll spy > reducers > removeActive`, () => {

    it('should remove a spy from the active array', () => {
        const spy = { node: 'testNode', target: 'testTarget' };
        const state = {
            active: [{ node: {}, target: {} }, spy]
        };
        expect(removeActive(state, spy)).toEqual({
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
        expect(removeActive(state, newSpy)).toEqual(state);
    });

});

describe(`Scroll spy > reducers > setDirection`, () => {

    it('should update the scroll direction', () => {
        const state = {
            scrollDirectionY: 'down',
        };
        expect(setDirection(state, 'up')).toEqual({
            scrollDirectionY: 'up',
        });
    });
});
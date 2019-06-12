import Component from '../src';


describe(`Measure > Initialisation`, () => {

    it('should return an Object', async () => {
        const __measure__ = Component.init('UA-141774857-1');
        expect(__measure__).not.toBeNull();
        expect(__measure__.getState).not.toBeNull();
        expect(__measure__.event).not.toBeNull();
    });

});
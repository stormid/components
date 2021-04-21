import Component from '../src';


describe(`Measure > Initialisation`, () => {

    it('should return an Object', async () => {
        const __measure__ = Component.init(global.tid);
        expect(__measure__).not.toBeNull();
        expect(__measure__.getState).not.toBeNull();
        expect(__measure__.event).not.toBeNull();
        expect(__measure__.ecommerce).not.toBeNull();
        expect(__measure__.ecommerce.impression).not.toBeNull();
        expect(__measure__.ecommerce.action).not.toBeNull();
    });


    it('should return without throwing if tid is not supplied', () => {
        const __measure__ = Component.init();
        expect(__measure__).toBeUndefined();
    });


    // it('should return without throwing if tid is not supplied', () => {
    //     const __measure__ = Component.init(TID);
    //     expect(__measure__).toBeUndefined();
    // });

});
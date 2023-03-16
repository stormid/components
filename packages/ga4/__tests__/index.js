import ga4 from '../src';

describe(`GA4 > Initialisation`, () => {

    it('should return without throwing if tid is not supplied', async () => {
        const warningSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const instance = await ga4();
        expect(instance).toBeUndefined();
        expect(warningSpy).toHaveBeenCalledWith('GA4: Missing tracking Id');
    });

    it('should return an Object', async () => {
        const instance = await ga4(global.tid);
        expect(instance).not.toBeNull();
        expect(instance.queue).not.toBeNull();
        expect(instance.track).not.toBeNull();
        expect(instance.getState).not.toBeNull();
        expect(instance.getState()).not.toBeNull();
    });


});
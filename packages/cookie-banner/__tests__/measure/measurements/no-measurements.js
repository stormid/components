import cookieBanner from '../../../src';

navigator = navigator || {};
navigator.sendBeacon = jest.fn();

describe('Cookie banner > measurements > no tid', () => {

    it('should not attempt tp send any measurements if there is no tid', () => {
        document.body.innerHTML = `<div></div>`;
        const __cb__ = cookieBanner({
            debug: true,
            hideBannerOnFormPage: false,
            secure: false,
            tid: false, //anything falsey will work
            types: {
                test: {}
            }
        });
        const persistentMeasurementParams = __cb__.getState().persistentMeasurementParams;
        expect(persistentMeasurementParams).toEqual(false);
        expect(navigator.sendBeacon).not.toHaveBeenCalled();
    });
});
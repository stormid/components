import CookieBanner from '../../../src';
import { composeParams, dataToURL, composeMeasurementConsent } from '../../../src/lib/measurement';
import { MEASUREMENTS } from '../../../src/lib/constants';
import defaults from '../../../src/lib/defaults';

navigator = navigator || {};
navigator.sendBeacon = jest.fn();

describe('Cookie banner > measure > banner/form/accept/change', () => {

    //user loads screen containing consent form, clicks banner accept
    it('should send banner display, form display, banner accept, and form submit beacons', () => {
        document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
        const __cb__ = CookieBanner({
            debug: true,
            hideBannerOnFormPage: false,
            secure: false,
            tid: 'UA-141774857-1',
            types: {
                test: {
                    title: 'Test title',
                    description: 'Test description',
                    labels: {
                        yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                        no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                    },
                    fns: [
                        () => { }
                    ]
                }
            }
        });
        const cid = __cb__.getState().persistentMeasurementParams.cid;
        const bannerDisplayReqURL = dataToURL({
            ...composeParams(cid, 'UA-141774857-1'),
            ...MEASUREMENTS.BANNER_DISPLAY
        }, 'collect');
        const formDisplayReqURL = dataToURL({
            ...composeParams(cid, 'UA-141774857-1'),
            ...MEASUREMENTS.FORM_DISPLAY
        }, 'collect');

        expect(navigator.sendBeacon).toHaveBeenCalled();
        //1. banner display tracked
        expect(navigator.sendBeacon).toHaveBeenNthCalledWith(1, bannerDisplayReqURL);
        //2. form display tracked
        expect(navigator.sendBeacon).toHaveBeenNthCalledWith(2, formDisplayReqURL);
        
        //3. click accept on banner tracked
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        const bannerAcceptUrl = dataToURL({
            ...composeParams(cid, 'UA-141774857-1'),
            ...MEASUREMENTS.BANNER_ACCEPT,
            cd2: composeMeasurementConsent(__cb__.getState().consent)
        }, 'collect');
        expect(navigator.sendBeacon).toHaveBeenNthCalledWith(3, bannerAcceptUrl);

        //4. Change preferences and submit form tracked
        const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
        fields[1].checked = true;
        document.querySelector(`.${defaults.classNames.submitBtn}`).click();

        const consentString = composeMeasurementConsent(__cb__.getState().consent);
        const preferenceSaveUrl = dataToURL({
            ...composeParams(cid, 'UA-141774857-1'),
            ...MEASUREMENTS.SAVE_PREFERENCES,
            cd2: consentString === '' ? 'None' : consentString,
            cm2: 0,
            cm3: 0
        }, 'collect');
        expect(navigator.sendBeacon).toHaveBeenNthCalledWith(4, preferenceSaveUrl);

    });

});
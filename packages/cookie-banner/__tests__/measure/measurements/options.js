import CookieBanner from '../../../src';
import { composeParams, dataToURL } from '../../../src/lib/measurement';
import { MEASUREMENTS } from '../../../src/lib/constants';

navigator = navigator || {};
navigator.sendBeacon = jest.fn();

describe('Cookie banner > measurements > options', () => {

    //user loads page clicks banner options
    it('should send banner display, banner options beacons', () => {
        document.body.innerHTML = `<div></div>`;
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
        expect(navigator.sendBeacon).toHaveBeenNthCalledWith(1, bannerDisplayReqURL);
        
        //2. click options on banner tracked
        document.querySelector(`.${__cb__.getState().settings.classNames.optionsBtn}`).click();
        const bannerOptionsUrl = dataToURL({
            ...composeParams(cid, 'UA-141774857-1'),
            ...MEASUREMENTS.BANNER_OPTIONS
        }, 'collect');
        expect(navigator.sendBeacon).toHaveBeenNthCalledWith(2, bannerOptionsUrl);
    });
});
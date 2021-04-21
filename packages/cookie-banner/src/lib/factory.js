import { cookiesEnabled, readCookie, noop, uuidv4 } from './utils';
import { initBanner, initForm } from './ui';
import { necessary, apply } from './consent';
import { createStore } from './store';
import { initialState } from './reducers';
import { MEASURE } from './constants';
import Measure from './measure';

export default settings => {
    /* istanbul ignore next */
    if (!cookiesEnabled()) return;
    
    const Store = createStore();
    const cookie = readCookie(settings);
    const consentID = cookie ? JSON.parse(cookie).consentID : uuidv4();
    const tid = MEASURE.TID;  
    const initialConsent = cookie ? JSON.parse(cookie).consent : { };
    let measurement = false;   

    const sr =  window.screen ? `${window.screen.width}x${window.screen.height}`: null;
    const vp = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`;

    measurement = Measure.init(tid, { 
        parameters: { 
            v:	1,
            ds:	'cookiebanner',
            dh: location.hostname,
            uip: '0.0.0.0',
            ua:	navigator.userAgent,
            sr: sr,
            vp: vp
        }
    });
     
    Store.update(
        initialState,
        { settings, consentID: consentID, measurement: measurement, consent: initialConsent },
        [ necessary, apply(Store), cookie ? noop : initBanner(Store), initForm(Store) ]
    );

    return { getState: Store.getState } ;
};
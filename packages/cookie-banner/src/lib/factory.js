import { cookiesEnabled, extractFromCookie, noop } from './utils';
import { initBanner, initForm } from './ui';
import { necessary, apply } from './consent';
import { createStore } from './store';
import { initialState } from './reducers';
import { composeParams } from './measurement';

export default settings => {
    /* istanbul ignore next */
    if (!cookiesEnabled()) return;
    if (!settings.tid) console.warn('Measurement tid setting missing');
    const Store = createStore();
    
    //extractFromCookie adds a try/catch guard for cookie reading and JSON.parse in case of cookie name collisions caused by versioning
    //for sites that are saving the cookie consent in a different shape, i.e. without cid and consent properties
    //and for sites with cookies that are not base64 encoded
    const [ hasCookie, cid, consent ] = extractFromCookie(settings);
     
    Store.update(
        initialState,
        {
            settings,
            persistentMeasurementParams: settings.tid ? composeParams(cid, settings.tid) : false,
            consent
        },
        [
            necessary,
            apply(Store),
            hasCookie ? noop : initBanner(Store),
            initForm(Store)
        ]
    );

    return { getState: Store.getState } ;
};
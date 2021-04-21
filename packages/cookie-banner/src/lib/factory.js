import { cookiesEnabled, readCookie, noop, uuidv4 } from './utils';
import { initBanner, initForm } from './ui';
import { necessary, apply } from './consent';
import { createStore } from './store';
import { initialState } from './reducers';
import { composeParams } from './measurement/utils';

export default settings => {
    /* istanbul ignore next */
    if (!cookiesEnabled()) return;
    
    const Store = createStore();
    const cookie = readCookie(settings);
    const cid = cookie ? JSON.parse(cookie).cid : uuidv4();
    const consent = cookie ? JSON.parse(cookie).consent : { };
     
    Store.update(
        initialState,
        {
            settings,
            persistentMeasurementParams: composeParams(cid),
            consent
        },
        [
            necessary,
            apply(Store),
            cookie ? noop : initBanner(Store),
            initForm(Store)
        ]
    );

    return { getState: Store.getState } ;
};
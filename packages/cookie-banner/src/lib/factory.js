import { cookiesEnabled, readCookie, noop } from './utils';
import { initBanner, initForm } from './ui';
import { necessary, apply } from './consent';
import { createStore } from './store';
import { initialState } from './reducers';

export default settings => {
    /* istanbul ignore next */
    if (!cookiesEnabled()) return;
    
    const Store = createStore();
    const cookie = readCookie(settings);
    Store.update(
        initialState,
        { settings, consent: cookie ? JSON.parse(cookie) : { } },
        [ necessary, apply(Store), cookie ? noop : initBanner(Store), initForm(Store) ]
    );

    return { getState: Store.getState } ;
};
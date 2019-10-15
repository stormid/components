import { cookiesEnabled, readCookie, noop } from './utils';
import { initBanner, initForm } from './ui';
import { necessary, apply } from './consent';
import { createStore } from './store';
import { initialState } from './reducers';

export default settings => {
    /* istanbul ignore next */
    if(!cookiesEnabled()) return;
    
    const Store = createStore();
    const cookies = readCookie(settings);
    Store.update(
        initialState,
        { settings, consent: cookies ? JSON.parse(cookies.value) : { } },
        [ necessary, apply(Store), cookies ? noop : initBanner(Store), initForm(Store) ]
    );

    return { getState: Store.getState } ;
};
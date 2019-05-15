import { cookiesEnabled, readCookie } from './utils';
import { initBanner, initUpdateBtn, initForm } from './ui';
import { apply } from './consent';
import { createStore } from './store';
import { initialState } from './reducers';

export default settings => {
    if(!cookiesEnabled()) return;
    
    const Store = createStore();
    const cookies = readCookie(settings);
    Store.update(
        initialState,
        { settings, consent: cookies ? JSON.parse(cookies.value) : { necessary: 1 } },
        [apply, cookies ? initUpdateBtn(Store) : initBanner(Store), initForm(Store)]
    );
};
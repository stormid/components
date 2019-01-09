import { cookiesEnabled, readCookie } from './utils';
import { initBanner, initUpdateBtn } from './ui';
import { apply } from './consent';
import CreateStore from './store';
import { initialState } from './reducers';

export default settings => {
    if(!cookiesEnabled()) return;
    
    const Store = CreateStore();
    const cookies = readCookie(settings);
    Store.update(
        initialState,
        { 
            settings,
            consent: cookies ? JSON.parse(cookies.value) : {} 
        },
        [apply(!cookies ? 'add' : 'remain'), cookies ? initUpdateBtn(Store) : initBanner(Store)]
    );
};
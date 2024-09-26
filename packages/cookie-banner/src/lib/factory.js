import { cookiesEnabled, extractFromCookie, noop, renderIframe, gtmSnippet, setGoogleConsent } from './utils';
import { showBanner, initBanner, initForm, initBannerListeners, keyListener } from './ui';
import { necessary, apply } from './consent';
import { createStore } from './store';
import { initialState } from './reducers';

export default settings => {
    /* istanbul ignore next */
    if (!cookiesEnabled()) return;
    const Store = createStore();
    
    //extractFromCookie adds a try/catch guard for cookie reading and JSON.parse in case of cookie name collisions caused by versioning
    //for sites that are saving the cookie consent in a different shape, i.e. without consent properties
    //and for sites with cookies that are not base64 encoded
    const [ hasCookie, consent ] = extractFromCookie(settings);
    
    Store.update(
        initialState,
        {
            settings,
            bannerOpen: false,
            keyListener: keyListener(Store),
            consent,
            utils: { renderIframe, gtmSnippet }
        },
        [
            necessary,
            setGoogleConsent(Store, 'default'),
            apply(Store),
            hasCookie ? noop : initBanner(Store),
            initForm(Store),
            initBannerListeners(Store),
            hasCookie ? setGoogleConsent(Store) : noop
        ]
    );

    return {
        getState: Store.getState,
        showBanner(cb) {
            showBanner(Store)(cb);
            initBannerListeners(Store)();
        },
        renderForm: initForm(Store)
    };
};
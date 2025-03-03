import { cookiesEnabled, extractFromCookie, renderIframe, gtmSnippet, setGoogleConsent } from './utils';
import { showBanner, initBanner, initForm, initBannerListeners, keyListener } from './ui';
import { necessary, apply } from './consent';
import { createStore } from './store';

export default settings => {
    /* istanbul ignore next */
    if (!cookiesEnabled()) return;
    const store = createStore();
    
    const [ hasCookie, consent ] = extractFromCookie(settings);
    
    store.update(
        {
            settings,
            bannerOpen: false,
            keyListener: keyListener(store),
            consent,
            utils: { renderIframe, gtmSnippet }
        },
        [
            necessary,
            setGoogleConsent(store, 'default'),
            apply(store),
            ...(hasCookie ? [] : [ initBanner(store) ]),
            initForm(store),
            initBannerListeners(store),
            ...(hasCookie ? [ setGoogleConsent(store) ] : [])
        ]
    );

    return {
        getState: store.getState,
        showBanner(cb) {
            showBanner(store)(cb);
            initBannerListeners(store)();
        },
        renderForm: initForm(store)
    };
};
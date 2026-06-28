import { cookiesEnabled, extractFromCookie, renderIframe, gtmSnippet, setGoogleConsent } from './utils.js';
import { showBanner, initBanner, initForm, initBannerListeners, keyListener } from './ui.js';
import { necessary, apply } from './consent.js';
import { createStore } from './store.js';

export default settings => {
    /* node:coverage ignore next */
    if (!cookiesEnabled()) return;
    if(!settings.bannerTemplate || !settings.formTemplate) {
        console.warn('Missing required cookie banner and/or preferences form markup. Cookie banner not initialised.');
        return;
    }
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
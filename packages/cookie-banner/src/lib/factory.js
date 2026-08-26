import { cookiesEnabled, extractFromCookie, renderIframe, gtmSnippet, setGoogleConsent, getRegistrableDomain } from './utils.js';
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

    // Derive the cookie domain once, here rather than at import: the probe runs only when a banner
    // is actually initialised, and the result is memoised in state.settings.domain for reuse.
    if (settings.domain === undefined) {
        const registrable = getRegistrableDomain();
        settings.domain = registrable ? `.${registrable}` : '';
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
            if (store.getState().bannerOpen) return;
            showBanner(store)(cb);
            initBannerListeners(store)();
        },
        renderForm: initForm(store)
    };
};
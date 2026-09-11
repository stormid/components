import { writeCookie, groupValueReducer, deleteCookies, getFocusableChildren, broadcast, setGoogleConsent } from './utils.js';
import { ACCEPTED_TRIGGERS, EVENTS, KEYS } from './constants.js';
import { apply, necessary } from './consent.js';
import { updateConsent, updateBannerOpen, updateBanner } from './reducers.js';

// Every template (banner, form, message) receives the same model: the full state, with the
// settings object also spread at the top level. So `model.classNames`/`model.policyURL` resolve
// (settings spread), `model.settings.*`/`model.consent` resolve, and any top-level state field the
// form/message templates previously received (they were passed raw state) is still present.
const templateModel = state => Object.assign({}, state, state.settings, {
    settings: state.settings,
    consent: state.consent
});

export const initBanner = store => () => {
    const state = store.getState();
    if (state.bannerOpen || (state.settings.hideBannerOnFormPage && document.querySelector(`.${state.settings.classNames.formContainer}`))) return;
    const markup = state.settings.bannerTemplate(templateModel(state));
    // firstElementChild is null on a page whose body has no element children — fall back to
    // inserting the banner as the body's first child rather than throwing.
    if (document.body.firstElementChild) document.body.firstElementChild.insertAdjacentHTML('beforebegin', markup);
    else document.body.insertAdjacentHTML('afterbegin', markup);
    
    store.update(
        updateBanner(state, {
            banner: document.querySelector(`.${state.settings.classNames.banner}`),
            bannerOpen: true
        }),
        [ broadcast(EVENTS.SHOW, store) ]
    );

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'stormcb_display' });
};

export const showBanner = store => callback => {
    initBanner(store)();
    if (!store.getState().bannerOpen) return;
    initForm(store)();
    const focusableChildren = getFocusableChildren(document.body.firstElementChild);
    if (focusableChildren.length > 0) focusableChildren[0].focus();
    if (callback && callback.call) callback(store.getState());
};

export const initBannerListeners = store => () => {
    const state = store.getState();
    const banner = state.banner;
    if (!banner) return;

    const composeSelector = classSelector => ACCEPTED_TRIGGERS.map(sel => `${sel}.${classSelector}`).join(', ');

    const composeConsentObjects = (event, consentVal) => {
        const consentObject = Object.keys(state.settings.types).reduce((acc, type) => {
            acc[type] = consentVal;
            return acc;
        },{});
        const analyticsObject = Object.entries(consentObject).reduce((acc, [key, value]) => {
            acc['stormcb_'+key] = value;
            return acc;
        }, { event: `stormcb_${event}_all` });
        return {
            consentObject,
            analyticsObject
        };
    };

    const acceptBtns = Array.from(document.querySelectorAll(composeSelector(state.settings.classNames.acceptBtn)));
    const rejectBtns = Array.from(document.querySelectorAll(composeSelector(state.settings.classNames.rejectBtn)));

    //bind to the instance's abort signal so destroy() removes these along with every other listener
    const signal = state.controller && state.controller.signal;

    if (state.settings.trapTab) document.addEventListener('keydown', state.keyListener, { signal });

    acceptBtns.forEach(acceptBtn => {
        acceptBtn.addEventListener('click', e => {
            const { consentObject, analyticsObject } = composeConsentObjects('accept', 1);
            const state = store.getState();
            store.update(
                updateConsent(state, consentObject),
                [
                    writeCookie,
                    apply(store),
                    removeBanner(store),
                    initForm(store),
                    () => {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push(analyticsObject);
                    },
                    broadcast(EVENTS.CONSENT, store),
                    setGoogleConsent(store),
                ]
            );
        }, { signal });
    });

    rejectBtns.forEach(rejectBtn => {
        rejectBtn.addEventListener('click', e => {
            const { consentObject, analyticsObject } = composeConsentObjects('reject', 0);
            const state = store.getState();
            store.update(
                updateConsent(state, consentObject),
                [
                    // Reject-all is the only path that clears cookies: withdrawing ALL consent is the
                    // one case where a blunt wipe is correct. Re-run the strictly-necessary consent fns
                    // afterwards so essential cookies the wipe removed are recreated without a reload.
                    deleteCookies,
                    necessary,
                    writeCookie,
                    removeBanner(store),
                    initForm(store),
                    () => {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push(analyticsObject);
                    },
                    broadcast(EVENTS.CONSENT, store),
                    setGoogleConsent(store),
                ]
            );
        }, { signal });
    });
};

const trapTab = state => event => {
    const focusableChildren = getFocusableChildren(state.banner);
    const focusedIndex = focusableChildren.indexOf(document.activeElement);

    if (event.shiftKey && focusedIndex === 0) {
        event.preventDefault();
        focusableChildren[focusableChildren.length - 1].focus();
    } else if (!event.shiftKey && focusedIndex === focusableChildren.length - 1) {
        event.preventDefault();
        focusableChildren[0].focus();
    }
};

export const keyListener = store => event => {
    if (store.getState().banner && event.key === KEYS.TAB) trapTab(store.getState())(event);
};

const removeBanner = store => () => {
    const state = store.getState();
    const banner = state.banner;
    if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
        store.update(updateBannerOpen(state, false), [ broadcast(EVENTS.HIDE, store) ]);
    }
    if (state.settings.trapTab) document.removeEventListener('keydown', state.keyListener);
};

const suggestedConsent = state => Object.keys(state.consent).length > 0
    ? state
    : Object.assign({}, state, {
        consent: Object.keys(state.settings.types).reduce((acc, type) => {
            if (state.settings.types[type].suggested) acc[type] = 1;
            return acc;
        }, {})
    });

export const initForm = store => () => {
    const state = store.getState();
    const formContainer = document.querySelector(`.${state.settings.classNames.formContainer}`);
    if (!formContainer) return;

    formContainer.innerHTML = state.settings.formTemplate(templateModel(suggestedConsent(state)));

    const form = document.querySelector(`.${state.settings.classNames.form}`);
    const button = document.querySelector(`.${state.settings.classNames.submitBtn}`);
    const groups = Array.from(document.querySelectorAll(`.${state.settings.classNames.field}`)).reduce((groups, field) => {
        const groupName = field.getAttribute('name').replace(/^privacy-/, '');
        if (groups[groupName]) groups[groupName].push(field);
        else groups[groupName] = [field];
        return groups;
    }, {});
    let formAnnouncement = document.querySelector(`.${state.settings.classNames.formAnnouncement}`);
    if (!formAnnouncement) {
        formAnnouncement = document.createElement('div');
        formAnnouncement.className = state.settings.classNames.formAnnouncement;
        //setAttribute reflects to the role attribute in every browser; the el.role IDL property
        //(ARIAMixin) is unsupported in older ones, leaving the live region unannounced
        formAnnouncement.setAttribute('role', 'alert');
        document.body.appendChild(formAnnouncement);
    }


    const extractConsentObjects = () => {
        const consentObject = Object.keys(groups).reduce((acc, key) => {
            const value = groups[key].reduce(groupValueReducer, '');
            if (value) acc[key] = parseInt(value, 10);
            return acc;
        }, {});

        const analyticsObject = Object.entries(consentObject).reduce((acc, [key, value]) => {
            acc['stormcb_'+key] = value;
            return acc;
        }, { event: `stormcb_save` });

        return {
            consentObject,
            analyticsObject
        };
    };

    //bind to the instance's abort signal so destroy() removes these along with every other listener
    const signal = state.controller && state.controller.signal;

    const enableButton = e => {
        if (Object.keys(extractConsentObjects().consentObject).length !== Object.keys(groups).length) return;
        button.removeAttribute('disabled');
        form.removeEventListener('change', enableButton);
    };
    button.hasAttribute('disabled') && form.addEventListener('change', enableButton, { signal });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const { consentObject, analyticsObject } = extractConsentObjects();
        const state = store.getState();
        store.update(
            updateConsent(state, consentObject),
            [
                writeCookie,
                apply(store),
                removeBanner(store),
                () => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push(analyticsObject);
                },
                broadcast(EVENTS.CONSENT, store),
                renderMessage(button),
                renderAnnouncement(formAnnouncement),
                setGoogleConsent(store),
            ]
        );
    }, { signal });

    if (window.location.hash.substring(1) === form.id) {
        window.scrollTo(0, form.getBoundingClientRect().top + window.scrollY);
    }
};

export const renderMessage = button => state => {
    button.insertAdjacentHTML('afterend', state.settings.messageTemplate(templateModel(state)));
    button.setAttribute('disabled', 'disabled');
    /* node:coverage ignore next */
    window.setTimeout(() => {
        button.parentNode.removeChild(button.nextElementSibling);
        button.removeAttribute('disabled');
    }, 3000);
};

export const renderAnnouncement = container => state => {
    container.textContent = state.settings.savedMessage;
    /* node:coverage ignore next */
    window.setTimeout(() => {
        container.textContent = '';
    }, 3000);
};
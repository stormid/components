import { writeCookie, groupValueReducer, deleteCookies, getFocusableChildren, broadcast, setGoogleConsent } from './utils';
import { ACCEPTED_TRIGGERS, EVENTS } from './constants';
import { apply } from './consent';
import { updateConsent, updateBannerOpen, updateBanner } from './reducers';

export const initBanner = store => () => {
    const state = store.getState();
    if (state.bannerOpen || (state.settings.hideBannerOnFormPage && document.querySelector(`.${state.settings.classNames.formContainer}`))) return;
    document.body.firstElementChild.insertAdjacentHTML('beforebegin', state.settings.bannerTemplate(state.settings));
    
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

    const acceptBtns = [].slice.call(document.querySelectorAll(composeSelector(state.settings.classNames.acceptBtn)));
    const rejectBtns = [].slice.call(document.querySelectorAll(composeSelector(state.settings.classNames.rejectBtn)));

    if (state.settings.trapTab) document.addEventListener('keydown', state.keyListener);

    acceptBtns.forEach(acceptBtn => {
        acceptBtn.addEventListener('click', e => {
            const { consentObject, analyticsObject } = composeConsentObjects('accept', 1);
            const state = store.getState();
            store.update(
                updateConsent(state, consentObject),
                [
                    deleteCookies,
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
        });
    });

    rejectBtns.forEach(rejectBtn => {
        rejectBtn.addEventListener('click', e => {
            const { consentObject, analyticsObject } = composeConsentObjects('reject', 0);
            const state = store.getState();
            store.update(
                updateConsent(state, consentObject),
                [
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
        });
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
    if (store.getState().banner && event.keyCode === 9) trapTab(store.getState())(event);
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

    formContainer.innerHTML = state.settings.formTemplate(suggestedConsent(state));

    const form = document.querySelector(`.${state.settings.classNames.form}`);
    const button = document.querySelector(`.${state.settings.classNames.submitBtn}`);
    const groups = [].slice.call(document.querySelectorAll(`.${state.settings.classNames.field}`)).reduce((groups, field) => {
        const groupName = field.getAttribute('name').replace('privacy-', '');
        if (groups[groupName]) groups[groupName].push(field);
        else groups[groupName] = [field];
        return groups;
    }, {});
    const formAnnouncement = document.querySelector(`.${state.settings.classNames.formAnnouncement}`)
                            || document.body.appendChild(Object.assign(document.createElement('div'), { className: state.settings.classNames.formAnnouncement, role: 'alert' }));


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

    const enableButton = e => {
        if (Object.keys(extractConsentObjects().consentObject).length !== Object.keys(groups).length) return;
        button.removeAttribute('disabled');
        form.removeEventListener('change', enableButton);
    };
    button.hasAttribute('disabled') && form.addEventListener('change', enableButton);
    
    form.addEventListener('submit', event => {
        event.preventDefault();
        const { consentObject, analyticsObject } = extractConsentObjects();
        const state = store.getState();
        store.update(
            updateConsent(state, consentObject),
            [
                deleteCookies,
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
    });

    if (window.location.hash.substring(1) === form.id) {
        window.scrollTo(0, form.getBoundingClientRect().top + window.scrollY);
    }
};

export const renderMessage = button => state => {
    button.insertAdjacentHTML('afterend', state.settings.messageTemplate(state));
    button.setAttribute('disabled', 'disabled');
    /* istanbul ignore next */
    window.setTimeout(() => {
        button.parentNode.removeChild(button.nextElementSibling);
        button.removeAttribute('disabled');
    }, 3000);
};

export const renderAnnouncement = container => state => {
    container.textContent = state.settings.savedMessage;
    /* istanbul ignore next */
    window.setTimeout(() => {
        container.textContent = '';
    }, 3000);
};
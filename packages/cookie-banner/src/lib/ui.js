import { writeCookie, groupValueReducer, deleteCookies, getFocusableChildren, broadcast } from './utils';
import { ACCEPTED_TRIGGERS, EVENTS } from './constants';
import { apply } from './consent';
import { updateConsent, updateBannerOpen, updateBanner } from './reducers';

export const initBanner = Store => () => {
    const state = Store.getState();
    if (state.bannerOpen || (state.settings.hideBannerOnFormPage && document.querySelector(`.${state.settings.classNames.formContainer}`))) return;
    document.body.firstElementChild.insertAdjacentHTML('beforebegin', state.settings.bannerTemplate(state.settings));
    
    Store.update(updateBanner, document.querySelector(`.${state.settings.classNames.banner}`));
    Store.update(updateBannerOpen, true, [ broadcast(EVENTS.SHOW, Store) ]);
};

export const showBanner = Store => cb => {
    initBanner(Store)();
    const { bannerOpen } = Store.getState();
    if (!bannerOpen) return;
    initForm(Store)();
    const focusableChildren = getFocusableChildren(document.body.firstElementChild);
    if (focusableChildren.length > 0) focusableChildren[0].focus();
    if (cb && cb.call) cb(Store.getState());
};

export const initBannerListeners = Store => () => {
    const state = Store.getState();
    const banner = state.banner;
    if (!banner) return;

    const composeSelector = classSelector => ACCEPTED_TRIGGERS.map(sel => `${sel}.${classSelector}`).join(', ');

    const acceptBtns = [].slice.call(document.querySelectorAll(composeSelector(state.settings.classNames.acceptBtn)));
    const rejectBtns = [].slice.call(document.querySelectorAll(composeSelector(state.settings.classNames.rejectBtn)));

    if (state.settings.trapTab) document.addEventListener('keydown', state.keyListener);

    acceptBtns.forEach(acceptBtn => {
        acceptBtn.addEventListener('click', e => {
            Store.update(
                updateConsent,
                Object.keys(state.settings.types).reduce((acc, type) => {
                    acc[type] = 1;
                    return acc;
                }, {}),
                [
                    writeCookie,
                    apply(Store),
                    removeBanner(Store),
                    initForm(Store, false),
                    broadcast(EVENTS.CONSENT, Store)
                ]
            );
        });
    });

    rejectBtns.forEach(rejectBtn => {
        rejectBtn.addEventListener('click', e => {
            Store.update(
                updateConsent,
                Object.keys(state.settings.types).reduce((acc, type) => {
                    acc[type] = 0;
                    return acc;
                }, {}),
                [
                    writeCookie,
                    removeBanner(Store),
                    initForm(Store, false),
                    broadcast(EVENTS.CONSENT, Store)
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

export const keyListener = Store => event => {
    if (Store.getState().banner && event.keyCode === 9) trapTab(Store.getState())(event);
};

const removeBanner = Store => () => {
    const state = Store.getState();
    const banner = state.banner;
    if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
        Store.update(updateBannerOpen, false, [ broadcast(EVENTS.HIDE, Store) ]);
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

export const initForm = (Store, track = true) => () => {
    const state = Store.getState();
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


    const extractConsent = () => Object.keys(groups).reduce((acc, key) => {
        const value = groups[key].reduce(groupValueReducer, '');
        if (value) acc[key] = parseInt(value, 10);
        return acc;
    }, {});

    const enableButton = e => {
        if (Object.keys(extractConsent()).length !== Object.keys(groups).length) return;
        button.removeAttribute('disabled');
        form.removeEventListener('change', enableButton);
    };
    button.hasAttribute('disabled') && form.addEventListener('change', enableButton);
    
    form.addEventListener('submit', event => {
        event.preventDefault();
        Store.update(
            updateConsent,
            extractConsent(),
            [
                deleteCookies,
                writeCookie,
                apply(Store),
                removeBanner(Store),
                broadcast(EVENTS.CONSENT, Store),
                renderMessage(button),
                renderAnnouncement(formAnnouncement)
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
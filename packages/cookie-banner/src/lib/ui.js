import { shouldReturn, writeCookie, groupValueReducer, deleteCookies } from './utils';
import { TRIGGER_EVENTS } from './constants';
import { apply } from './consent';
import { updateConsent } from './reducers';

export const initBanner = Store => state => {
    if (state.settings.hideBannerOnFormPage && document.querySelector(`.${state.settings.classNames.formContainer}`)) return;
    document.body.firstElementChild.insertAdjacentHTML('beforebegin', state.settings.bannerTemplate(state.settings));

    if(state.measurement ){
        state.measurement.event({
            cid: state.consentID,
            ec: 'Banner', 
            ea: 'Displays', 
            cd1: state.consentID, 
            cd3: location.hostname, 
            cm1: 1
        });
    }
    
    const banner = document.querySelector(`.${state.settings.classNames.banner}`);
    const acceptBtn = document.querySelector(`.${state.settings.classNames.acceptBtn}`);
    const optionsBtn = document.querySelector(`.${state.settings.classNames.optionsBtn}`);

    TRIGGER_EVENTS.forEach(event => {
        acceptBtn.addEventListener(event, e => {
            if (shouldReturn(e)) return;

            Store.update(
                updateConsent,
                Object.keys(state.settings.types).reduce((acc, type) => {
                    acc[type] = 1;
                    return acc;
                }, {}),
                [
                    writeCookie,
                    apply(Store),
                    removeBanner(banner),
                    initForm(Store),
                    () => {
                        const consent = Store.getState().consent;
                        const consentString = Object.keys(consent).filter(function(key) {
                            return consent[key]
                        }).join(',');
                        if(state.measurement) {
                            state.measurement.event({
                                cid: state.consentID,
                                ec: 'Save preferences', 
                                ea: 'Banner', 
                                cd1: state.consentID, 
                                cd2: consentString,
                                cd3: location.hostname, 
                                cm2: 1,
                                cm3: 1
                            });
                        }   
                    }
                ]
            );   
        });

        optionsBtn.addEventListener(event, e => {
            e.preventDefault();
            if(state.measurement) {
                state.measurement.event({
                    cid: state.consentID,
                    ec: 'Banner', 
                    ea: 'Clicks', 
                    el: 'Edit preferences',
                    cd1: state.consentID, 
                    cd3: location.hostname, 
                    cm4: 1
                }, e.target.href);
            }
        });
    });
};

const removeBanner = banner => () => (banner && banner.parentNode) && banner.parentNode.removeChild(banner);

const suggestedConsent = state => Object.keys(state.consent).length > 0
    ? state
    : Object.assign({}, state, {
        consent: Object.keys(state.settings.types).reduce((acc, type) => {
            if (state.settings.types[type].suggested) acc[type] = 1;
            return acc;
        }, {})
    });

export const initForm = Store => state => {
    const formContainer = document.querySelector(`.${state.settings.classNames.formContainer}`);
    if (!formContainer) return;

    formContainer.innerHTML = state.settings.formTemplate(suggestedConsent(state));

    if(state.measurement) {
        state.measurement.event({
            cid: state.consentID,
            ec: 'CookiePrefsWidget', 
            ea: 'Displays', 
            el: 'Edit preferences',
            cd1: state.consentID, 
            cd3: location.hostname, 
            cm5: 1
        });
    }

    const form = document.querySelector(`.${state.settings.classNames.form}`);
    const banner = document.querySelector(`.${state.settings.classNames.banner}`);
    const button = document.querySelector(`.${state.settings.classNames.submitBtn}`);
    const groups = [].slice.call(document.querySelectorAll(`.${state.settings.classNames.field}`)).reduce((groups, field) => {
        const groupName = field.getAttribute('name').replace('privacy-', '');
        if (groups[groupName]) groups[groupName].push(field);
        else groups[groupName] = [field];
        return groups;
    }, {});

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
                removeBanner(banner),
                renderMessage(button),
                () => {
                    if(state.measurement ){
                        const state = Store.getState();
                        const consentString = Object.keys(state.consent).filter(function(key) {
                            return state.consent[key]
                        }).join(',');
                        if (consentString === '') consentString = "None";
                        Store.getState().measurement.event({
                            cid: state.consentID,
                            ec: 'Save preferences', 
                            ea: 'CookiePrefs', 
                            cd1: state.consentID, 
                            cd2: consentString,
                            cd3: location.hostname,
                            cm2: state.consent["performance"] ? state.consent["performance"] : 0 ,
                            cm3: state.consent["thirdParty"] ? state.consent["thirdParty"] : 0
                        });
                    }
                }
            ]
        );
    });
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
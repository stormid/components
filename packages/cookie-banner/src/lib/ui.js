import { shouldReturn, writeCookie, groupValueReducer, deleteCookies } from './utils';
import { TRIGGER_EVENTS, MEASUREMENTS } from './constants';
import { apply } from './consent';
import { updateConsent } from './reducers';
import { measure, composeMeasurementConsent } from './measurement';

export const initBanner = Store => state => {
    if (state.settings.hideBannerOnFormPage && document.querySelector(`.${state.settings.classNames.formContainer}`)) return;
    document.body.firstElementChild.insertAdjacentHTML('beforebegin', state.settings.bannerTemplate(state.settings));
    
    //track banner display
    if (state.settings.tid) measure(state, MEASUREMENTS.BANNER_DISPLAY);

    const banner = document.querySelector(`.${state.settings.classNames.banner}`);
    const acceptBtns = [].slice.call(document.querySelectorAll(`.${state.settings.classNames.acceptBtn}`));
    const optionsBtn = document.querySelector(`.${state.settings.classNames.optionsBtn}`);

    TRIGGER_EVENTS.forEach(event => {
        acceptBtns.forEach(acceptBtn => {
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
                        initForm(Store, false),
                        //track banner accept click
                        state => {
                            if (state.settings.tid) {
                                measure(state, {
                                    ...MEASUREMENTS.BANNER_ACCEPT,
                                    cd2: composeMeasurementConsent(Store.getState().consent)
                                });
                            }
                        }
                    ]
                );
            });
        });

        //track options click
        //shouldn't have to catch and replay the event since we're using beacons
        if (optionsBtn && state.settings.tid) optionsBtn.addEventListener(event, e => measure(state, MEASUREMENTS.BANNER_OPTIONS));
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

export const initForm = (Store, track = true) => state => {
    const formContainer = document.querySelector(`.${state.settings.classNames.formContainer}`);
    if (!formContainer) return;

    formContainer.innerHTML = state.settings.formTemplate(suggestedConsent(state));

    //measure form display
    //track flag is false if a re-render from a banner acceptance
    if (state.settings.tid && track) measure(state, MEASUREMENTS.FORM_DISPLAY);

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
                state => {
                    if (!state.settings.tid) return;
                    const consentString = composeMeasurementConsent(state.consent);
                    const consent = consentString === '' ? 'None' : consentString;
                    measure(state, {
                        ...MEASUREMENTS.SAVE_PREFERENCES,
                        cd2: consent,
                        cm2: state.consent.performance ? state.consent.performance : 0,
                        cm3: state.consent.thirdParty ? state.consent.thirdParty : 0
                    });
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
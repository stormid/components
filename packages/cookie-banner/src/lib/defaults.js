/* node:coverage disable */
export default {
    name: '.CookiePreferences',
    path: '/',
    domain: undefined, // auto-derived from the host once at init (see factory), unless overridden
    secure: true,
    samesite: 'strict',
    expiry: 365,
    types: {},
    necessary: [],
    policyURL: '/cookie-policy/#preferences',
    classNames: {
        banner: 'privacy-banner',
        acceptBtn: 'privacy-banner__accept',
        rejectBtn: 'privacy-banner__reject',
        submitBtn: 'privacy-banner__submit',
        optionsBtn: 'privacy-banner__options',
        field: 'privacy-banner__field',
        form: 'privacy-banner__form',
        fieldset: 'privacy-banner__fieldset',
        legend: 'privacy-banner__legend',
        formContainer: 'privacy-banner__form-container',
        formMessage: 'privacy-banner__form-msg',
        formAnnouncement: 'privacy-banner__form-announcement',
        title: 'privacy-banner__form-title',
        description: 'privacy-banner__form-description',
        bannerToggle: 'on--privacy-banner-toggle',
        bannerToggleTrigger: 'js-toggle-btn'
    },
    hideBannerOnFormPage: true,
    trapTab: false,
    savedMessage: 'Your settings have been saved.',
    messageTemplate(model){
        return `<div class="${model.settings.classNames.formMessage}" aria-hidden="true">${model.settings.savedMessage}</div>`
    },
    bannerTemplate: null,
    formTemplate: null
};
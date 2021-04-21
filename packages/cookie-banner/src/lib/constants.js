/* istanbul ignore file */
export const TRIGGER_EVENTS = ['click', 'keydown'];

export const TRIGGER_KEYCODES = [13, 32];

export const MEASUREMENTS = {
    BANNER_DISPLAY: {
        ec: 'Banner', 
        ea: 'Displays',
        cd3: location.hostname, 
        cm1: 1
    },
    BANNER_ACCEPT: {
        ec: 'Save preferences', 
        ea: 'Banner', 
        cm2: 1,
        cm3: 1
    },
    BANNER_CLICKS: {},
    FORM_DISPLAYS: {
        ec: 'CookiePrefsWidget', 
        ea: 'Displays',
        el: 'Edit preferences',
        cm5: 1
    },
    PREFERENCES_SAVE: {
        ec: 'Save preferences', 
        ea: 'CookiePrefs'
    }
};
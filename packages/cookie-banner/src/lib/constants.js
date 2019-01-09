export const TRIGGER_EVENTS = window.PointerEvent ? ['pointerup', 'keydown'] : ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ];

export const TRIGGER_KEYCODES = [13, 32];

export const CLASSNAME = {
    BANNER: 'preferences-banner',
    FIELD: 'preferences-banner__field',
    BTN: 'preferences-banner__btn'
};

export const DATA_ATTRIBUTE = {
    TYPE: 'data-consent-type',
    ID: 'data-consent-id'
};
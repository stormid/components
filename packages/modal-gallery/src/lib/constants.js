/* istanbul ignore file */
export const KEY_CODES = {
    TAB: 9,
    ESC: 27,
    LEFT: 37,
    RIGHT: 39
};

export const TRIGGER_EVENTS = window.PointerEvent ? ['pointerup', 'keydown'] : ['ontouchend' in window ? 'ontouchend' : 'click', 'keydown' ];

export const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];
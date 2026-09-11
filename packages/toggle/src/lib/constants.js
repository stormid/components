/* node:coverage disable */
export const ACCEPTED_TRIGGERS = ['button', 'a'];

export const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

export const KEYS = {
    TAB: 'Tab',
    ENTER: 'Enter',
    SPACE: ' ',
    SPACE_LEGACY: 'Spacebar'
};

export const EVENTS = {
    OPEN: 'toggle.open',
    CLOSE: 'toggle.close'
};

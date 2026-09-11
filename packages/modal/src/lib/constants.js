/* node:coverage disable */
export const ACCEPTED_TRIGGERS = ['button', 'a'];

export const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

// Keyboard keys (KeyboardEvent.key values) the modal responds to
export const KEYS = {
    ESC: 'Escape',
    TAB: 'Tab'
};

export const EVENTS = {
    OPEN: 'modal.open',
    CLOSE: 'modal.close'
};
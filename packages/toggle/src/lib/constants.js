/* istanbul ignore file */
export const ACCEPTED_TRIGGERS = ['button', 'a'];

export const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

export const EVENTS = {
    OPEN: 'toggle.open',
    CLOSE: 'toggle.close'
};
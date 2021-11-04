/* istanbul ignore file */
// DOM events on a trigger that initiate toggle
export const TRIGGER_EVENTS = ['click', 'keydown'];

// Event keycodes that initiate toggle for keyboard events
export const TRIGGER_KEYCODES = [13, 32];

//Array of focusable child elements
export const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

export const EVENTS = {
    OPEN: 'toggle.open',
    CLOSE: 'toggle.close'
};
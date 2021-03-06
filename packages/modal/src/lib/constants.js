/* istanbul ignore file */
// DOM events on a trigger that initiate toggle
export const TRIGGER_EVENTS = ['click', 'keydown'];

// Event keycodes that initiate toggle for keyboard events
export const KEYCODES = [32, 13];

//Array of focusable child elements
export const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];
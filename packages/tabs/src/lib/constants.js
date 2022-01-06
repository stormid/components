/* istanbul ignore file */
// DOM events on a trigger that initiate toggle
export const TRIGGER_EVENTS = window.PointerEvent ? ['pointerdown', 'keydown'] : ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ];

// Event keycodes that initiate toggle for keyboard events
export const KEYCODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
};

/* @property activation, string, 'auto' or 'manual' describes tab activation method.  
 as per https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html or https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html */
export const MODES = {
    MANUAL:'manual',
    AUTO: 'auto'
}

//Array of focusable child elements
export const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];
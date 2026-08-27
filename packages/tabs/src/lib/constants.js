/* node:coverage disable */
// Keyboard keys (KeyboardEvent.key values) that drive tab interaction
export const KEYS = {
    SPACE: ' ',
    SPACE_LEGACY: 'Spacebar',
    ENTER: 'Enter',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End'
};

/* @property activation, string, 'auto' or 'manual' describes tab activation method.
 as per https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html or https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html */
export const MODES = {
    MANUAL: 'manual',
    AUTO: 'auto'
};

//Array of focusable child elements, used to decide whether a panel needs tabindex="0"
export const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

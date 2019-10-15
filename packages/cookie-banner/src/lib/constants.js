/* istanbul ignore file */
export const TRIGGER_EVENTS = window.PointerEvent ? ['pointerup', 'keydown'] : ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ];

export const TRIGGER_KEYCODES = [13, 32];
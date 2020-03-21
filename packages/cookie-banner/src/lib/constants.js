/* istanbul ignore file */
export const TRIGGER_EVENTS = window.PointerEvent ? ['pointerup', 'keydown'] : ['ontouchend' in window ? 'ontouchend' : 'click', 'keydown' ];

export const TRIGGER_KEYCODES = [13, 32];
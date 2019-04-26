// DOM events on a trigger that initiate toggle
export const TRIGGER_EVENTS = ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ];

// Event keycodes that initiate toggle for keyboard events
export const KEYCODES = [32, 13];

export const DATA_ATTRIBUTE = {
    DELETE: 'data-repeater-delete'
};
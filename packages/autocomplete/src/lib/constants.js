/* node:coverage disable */
//dispatched from the component node (bubbling) so consumers can react to
//selection changes and list visibility without holding the instance — one event
//name per action (confirm/remove/clear/open/close), which is also echoed on the
//event's detail.action
export const EVENTS = {
    confirm: 'autocomplete:confirm',
    remove: 'autocomplete:remove',
    clear: 'autocomplete:clear',
    open: 'autocomplete:open',
    close: 'autocomplete:close'
};

// Keyboard keys (KeyboardEvent.key values) the combobox responds to.
// KeyboardEvent.keyCode is deprecated - match on the standard event.key string instead.
export const KEYS = {
    BACKSPACE: 'Backspace',
    TAB: 'Tab',
    ENTER: 'Enter',
    ESC: 'Escape',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown'
};
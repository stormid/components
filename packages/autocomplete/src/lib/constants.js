/* node:coverage disable */
//dispatched from the component node (bubbling) so consumers can react to
//selection changes without holding the instance — one event name per action
//(confirm/remove/clear), which is also echoed on the event's detail.action
export const EVENTS = {
    confirm: 'autocomplete:confirm',
    remove: 'autocomplete:remove',
    clear: 'autocomplete:clear'
};

export const KEYCODES = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    27: 'escape',
    32: 'space',
    38: 'up',
    40: 'down'
};
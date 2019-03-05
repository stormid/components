import { KEY_CODES, TRIGGER_EVENTS, DATA_ATTRIBUTES } from './constants';
import { dispatchSyntheticEvent } from './utils';

let state = {};

const toggle = () => {
    if(!state.node.checked) return;
    state.groupNodes.forEach(node => {
        node.checked = state.node.checked ? false : node.checked;
        dispatchSyntheticEvent(node, 'change');
    });
};

export default (node, settings) => {
    const groupNodes = [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.GROUP_NAME}="${node.getAttribute(DATA_ATTRIBUTES.SELECTOR)}"]`));
    state = Object.assign({}, state, {
        node,
        settings,
        groupNodes
    });
    TRIGGER_EVENTS.forEach(ev => {
        state.node.addEventListener(ev, e => {
            if(!e.keyCode || (node.nodeName.toLowerCase() !== 'input' && !!~KEY_CODES.indexOf(e.keyCode))) toggle();
        });
        state.groupNodes.forEach(groupNode => {
            groupNode.addEventListener(ev, e => {
                if((!e.keyCode || (node.nodeName.toLowerCase() !== 'input' && !!~KEY_CODES.indexOf(e.keyCode))) && node.checked) state.node.checked = false;
            });
        });
    });

    return state;
};
import { KEY_CODES, TRIGGER_EVENTS, DATA_ATTRIBUTES } from './constants';
import { dispatchSyntheticEvent } from './utils';

let state = { checked: false };

const toggle = () => {
    state = Object.assign({}, state, {
        checked: !state.checked
    });
    render();
};

const render = () => {
    state.groupNodes.forEach(node => {
        node.checked = state.checked;
        dispatchSyntheticEvent(node, 'change');
    });
    state.labelNode.innerText = state.checked ? state.settings.activeLabel : state.settings.defaultLabel;
};

export default (node, settings) => {
    state = Object.assign({}, state, {
        node,
        settings,
        labelNode: node.nodeName.toLowerCase() === 'input' ? document.querySelector(`[for="${node.getAttribute('id')}"]`) : node,
        groupNodes: [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.GROUP_NAME}="${node.getAttribute(DATA_ATTRIBUTES.SELECTOR)}"]`))
    });

    TRIGGER_EVENTS.forEach(ev => {
        node.addEventListener(ev, e => {
            if(!e.keyCode || (node.nodeName.toLowerCase() !== 'change' && !!~KEY_CODES.indexOf(e.keyCode))) toggle();
        })
    });

    return {
        toggle
    }
};
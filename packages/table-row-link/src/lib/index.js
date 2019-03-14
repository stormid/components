import { dispatchSyntheticEvent } from './utils';

const toggle = () => {
    if(!state.node.checked) return;
    state.groupNodes.forEach(node => {
        node.checked = state.node.checked ? false : node.checked;
        dispatchSyntheticEvent(node, 'change');
    });
};

const findParentRow = node => {
    let row = false,
        parent = node.parentNode;
    while(parent && !row){
        if(parent.tagName === 'TR') row = parent;
        parent = parent.parentNode
    }
    return row;
};

export default (node, settings) => {
    const state = {
        node,
        settings,
        row: findParentRow(node),
    };

    state.row.addEventListener('focusin', e => {
        state.row.classList.add(settings.activeClassName);
    });
    state.row.addEventListener('focusout', e => {
        state.row.classList.remove(settings.activeClassName);
    });





    // const groupNodes = [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.GROUP_NAME}="${node.getAttribute(DATA_ATTRIBUTES.SELECTOR)}"]`));
    // state = Object.assign({}, state, {
    //     node,
    //     settings,
    //     groupNodes
    // });
    // TRIGGER_EVENTS.forEach(ev => {
    //     state.node.addEventListener(ev, e => {
    //         if(!e.keyCode || (node.nodeName.toLowerCase() !== 'input' && !!~KEY_CODES.indexOf(e.keyCode))) toggle();
    //     });
    //     state.groupNodes.forEach(groupNode => {
    //         groupNode.addEventListener(ev, e => {
    //             if((!e.keyCode || (node.nodeName.toLowerCase() !== 'input' && !!~KEY_CODES.indexOf(e.keyCode))) && node.checked) state.node.checked = false;
    //         });
    //     });
    // });

    return state;
};
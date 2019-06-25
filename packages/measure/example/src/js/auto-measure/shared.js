import { TRIGGER_KEYCODES, DATA_ATTRIBUTES } from './constants';

export const handler = (data, __m) => e => {
    if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode) 
        || (e.which && e.which === 3)) return;
    __m.ecommerce.action(data);
};

export const composeAction = (node, action, event) => ({
    event, //ea
    action, //pa
    data: JSON.parse(node.getAttribute(DATA_ATTRIBUTES.ITEM))
});

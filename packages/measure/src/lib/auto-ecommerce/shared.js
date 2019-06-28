import { TRIGGER_KEYCODES, DATA_ATTRIBUTES } from './constants';

export const handler = (data, __m) => e => {
    if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode) 
        || (e.which && e.which === 3)) return;
    __m.ecommerce.action(data);
};

export const composeAction = ({ node, category = undefined, event, action = undefined }) => ({
    category,
    event, //ea
    action, //pa
    data: JSON.parse(node.getAttribute(DATA_ATTRIBUTES.ITEM) || node.getAttribute(DATA_ATTRIBUTES.ITEMS))
});

export const composePurchaseAction = ({ node, category = undefined, event, action = undefined }) => ({
    category,
    event, //ea
    action, //pa
    data: JSON.parse(node.getAttribute(DATA_ATTRIBUTES.ITEM) || node.getAttribute(DATA_ATTRIBUTES.ITEMS)),
    purchase: JSON.parse(node.getAttribute(DATA_ATTRIBUTES.PURCHASE))
});

export const composeCheckoutAction = ({ node, category = undefined, event, action = undefined }) => ({
    category,
    event, //ea
    action, //pa
    data: JSON.parse(node.getAttribute(DATA_ATTRIBUTES.ITEM) || node.getAttribute(DATA_ATTRIBUTES.ITEMS)),
    step: node.getAttribute(DATA_ATTRIBUTES.CHECKOUT_STEP),
    option: node.getAttribute(DATA_ATTRIBUTES.CHECKOUT_STEP_OPTION)
});
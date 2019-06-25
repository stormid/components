import { TRIGGER_EVENTS, TRIGGER_KEYCODES, DATA_ATTRIBUTES } from './constants';

export const impressions = __m => {
    const nodes = Array.from(document.querySelectorAll(`[${DATA_ATTRIBUTES.IMPRESSION}]`));
    if(nodes.length === 0) return;
    let listed = {};
    let unlisted = [];

    for(let node of nodes){
        const impression = node.getAttribute(DATA_ATTRIBUTES.IMPRESSION);
        const item = node.getAttribute(DATA_ATTRIBUTES.ITEM);
        if(impression === undefined || !item) continue;

        if(impression !== ''){
            if(listed[impression]) listed[impression].push(JSON.parse(item));
            else listed[impression] = [JSON.parse(item)]

        } else unlisted.push(JSON.parse(item));
    }
    __m.ecommerce.impression({
        lists: [
            ...(Object.keys(listed).length > 0 ? Object.keys(listed).reduce((acc, key) => [
                ...acc,
                { name: key, items: listed[key] }
            ], []) : []),
            ...(unlisted.length > 0 ? [{ items: unlisted }] : [])
        ]
    });
};

const handler = (data, __m) => e => {
    if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode) 
        || (e.which && e.which === 3)) return;
    __m.ecommerce.action(data);
};

//update to accept event
const composeAction = (node, action) => ({
    event: `Product ${action}`, //ea
    action, //pa
    data: JSON.parse(node.getAttribute(DATA_ATTRIBUTES.ITEM))
});


export const click = __m => {
    const nodes = Array.from(document.querySelectorAll(`[${DATA_ATTRIBUTES.CLICK}]`));
    if(nodes.length === 0) return;
    
    for(let node of nodes){
        TRIGGER_EVENTS.forEach(ev => {
            node.addEventListener(ev, handler(composeAction(node, 'click'), __m), { composed: true, useCapture: true });
        });
    }
};

export const detail = __m => {
    const nodes = Array.from(document.querySelectorAll(`[${DATA_ATTRIBUTES.DETAIL}]`));
    if(nodes.length === 0) return;
    
    for(let node of nodes){
        __m.ecommerce.action(composeAction(node, 'detail'));
    }
};

export const add = __m => {
    const nodes = Array.from(document.querySelectorAll(`[${DATA_ATTRIBUTES.CLICK}]`));
    if(nodes.length === 0) return;
    
    for(let node of nodes){
        TRIGGER_EVENTS.forEach(ev => {
            node.addEventListener(ev, handler(composeAction(node, 'add', 'Add to cart'), __m), { composed: true, useCapture: true });
        });
    }
};
import { DATA_ATTRIBUTES } from './constants';

export default __m => {
    const nodes = [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.IMPRESSION}]`));
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
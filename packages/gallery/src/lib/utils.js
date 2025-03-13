import { change } from './dom';

export const sanitise = item => item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const composeItems = (nodes, settings) => nodes.map(node => ({ node }));

export const composeDOM = (node, settings) => ({
    liveRegion: node.querySelector(settings.selector.liveRegion),
    fullscreen: node.querySelector(settings.selector.fullscreen),
    previous: node.querySelector(settings.selector.previous),
    next: node.querySelector(settings.selector.next),
    triggers: [].slice.call(document.querySelectorAll(settings.selector.navigate))
});

export const getIndexFromURL = (name, items, url, fallback = false) => {
    const hash = url.split(`#`)[1] || '';
    if (hash.indexOf(`${name}-`) === -1) return [ fallback ];
    const num = Number(hash.split(`${name}-`)[1]);
    if (isNaN(num)) return console.warn('Gallery hash not valid'), [ fallback ];
    const index = num - 1;
    if (index < 0 || index > (items.length - 1)) return console.warn('Gallery index out of bounds'), [ fallback ];
    return [ index, true ];
};

export const popstateHandler = store => e => {
    if (!e.state) return;
    const url = e.state.URL;
    const { name, items } = store.getState();
    const [ index ] = getIndexFromURL(name, items, url);
    if (index === false) return;
    change(store, index);
};

export const getSelection = selector => {
    if (typeof selector === 'string') return [].slice.call(document.querySelectorAll(selector));
    if (selector instanceof Array) return selector;
    if (Object.prototype.isPrototypeOf.call(NodeList.prototype, selector)) return [].slice.call(selector);
    if (selector instanceof HTMLElement) return [selector];
    return [];
};
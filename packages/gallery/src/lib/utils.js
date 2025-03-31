import { change } from './dom';

export const sanitise = item => item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const composeDOM = (node, settings) => ({
    liveRegion: node.querySelector(settings.selector.liveRegion),
    fullscreen: node.querySelector(settings.selector.fullscreen),
    previous: node.querySelector(settings.selector.previous),
    next: node.querySelector(settings.selector.next),
    triggers: [].slice.call(document.querySelectorAll(settings.selector.navigate))
});

export const getIndexFromURL = (items, url, fallback = false) => {
    const hash = url.split(`#`)[1] || '';
    if (hash === '') return fallback;
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === hash) return i;
    }
    return fallback;
};

export const getPosition = ({ list, items }) => {
    const scrollPosition = list.scrollLeft;
    const itemWidth = items[0].clientWidth;
    if (scrollPosition === 0 && itemWidth === 0) return;
    if (Number.isNaN(itemWidth) || Number.isNaN(scrollPosition)) return;
    if (scrollPosition === 0) return 0;
    return Math.round(scrollPosition / itemWidth);
};

export const hashchangeHandler = store => e => {
    const url = e.newURL;
    const { items } = store.getState();
    const index = getIndexFromURL(items, url);
    if (index === false) return;
    change(store, index, { fromListener: true });
};

export const scrollHandler = store => e => {
    const { list, items, activeIndex } = store.getState();
    const index = getPosition({ list, items } );
    if (index === undefined) return;
    if (index === activeIndex) return;
    change(store, index, { fromScroll: true });
};

//ensure each gallery item has a unique id
//used for updating the URL and for accessibility
export const patchAccessibility = (items, index) => items.map((item, idx) => {
    // if the item has an id, but it is a duplicate, warn the user
    if (item.hasAttribute('id')) {
        if (Array.from(document.querySelectorAll(`#${item.id}`)).length > 1) {
            console.warn(`Gallery item id "${item.id}" is not unique, please ensure each gallery item has a unique id`);
        }
    } else {
        let id = `gallery-${index + 1}-${idx + 1}`;
        // check for duplicate ids across whole document in case multiple galleries have been initialised separately, add 100 to index
        while (document.getElementById(id)) {
            id = `gallery-${(index + 100) + 1}-${idx + 1}`;
        }
        item.setAttribute('id', id);
    }
    //ensure the item is focusable
    // if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', 0);
    return item;
});

export const getSelection = selector => {
    if (typeof selector === 'string') return [].slice.call(document.querySelectorAll(selector));
    if (selector instanceof Array) return selector;
    if (Object.prototype.isPrototypeOf.call(NodeList.prototype, selector)) return [].slice.call(selector);
    if (selector instanceof HTMLElement) return [selector];
    return [];
};

export function throttle (fn, boundary) {
    let last = -Infinity;
    let timer;
    return function bounced () {
        if (timer) {
            return;
        }
        unbound();
  
        function unbound () {
            clearTimeout(timer);
            timer = null;
            let next = last + boundary;
            let now = Date.now();
            if (now > next) {
                last = now;
                fn();
            } else {
                timer = setTimeout(unbound, next - now);
            }
        }
    };
};
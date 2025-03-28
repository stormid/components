import { change, writeLiveRegion } from './dom';

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
    const index = getPosition(store.getState());
    if (index === undefined) return;
    change(store, index, { fromScroll: true });
};

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
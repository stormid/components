import defaults from './defaults/index.js';
import factory from './factory.js';

const create = (items, options) => Object.create(factory({
    items,
    settings: { ...defaults, ...options }
}));

/*
 * Converts a passed selector which can be of varying types into an array of DOM Objects
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList, an HTMLCollection or a single DOM element.
 */
export const getSelection = selector => {
    if (typeof selector === 'string') return Array.from(document.querySelectorAll(selector));
    if (Array.isArray(selector)) return selector;
    if (selector instanceof NodeList || selector instanceof HTMLCollection) return Array.from(selector);
    if (selector && selector.nodeType === 1) return [selector]; // nodeType check is cross-realm safe, unlike instanceof HTMLElement
    return [];
};

/*
 * Normalises a selection entry into an item model. DOM elements are read from their
 * href/data-* attributes; plain objects (programmatic init) are passed through unchanged.
 */
const toItem = el => (el instanceof HTMLElement) ? {
    trigger: el,
    src: el.getAttribute('href'),
    srcset: el.getAttribute('data-srcset') || null,
    sizes: el.getAttribute('data-sizes') || null,
    title: el.getAttribute('data-title') || '',
    description: el.getAttribute('data-description') || ''
} : el;

export const singles = (src, opts) => {
    let els = getSelection(src);
    if (!els.length) return void console.warn('Modal Gallery cannot be initialised, no images found');

    return els.map(el => create([toItem(el)], opts));
};

export const galleries = (src, opts) => {
    let els = getSelection(src);
    if (!els.length) return void console.warn('Modal Gallery cannot be initialised, no images found');

    return create(els.map(toItem), opts);
};
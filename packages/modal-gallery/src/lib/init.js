import defaults from './defaults/';
import factory from './factory';

const create = (items, options) => Object.create(factory({
    items,
    settings: { ...defaults, ...options }
}));

/*
 * Converts a passed selector which can be of varying types into an array of DOM Objects
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 */
export const getSelection = (selector) => {

    if (typeof selector === "string") return [].slice.call(document.querySelectorAll(selector));
    if (selector instanceof Array) return selector;
    if (Object.prototype.isPrototypeOf.call(NodeList.prototype, selector)) return [].slice.call(selector);
    if (selector instanceof HTMLElement) return [selector]; 
    return [];
}

export const singles = (src, opts) => {
    let els = getSelection(src);
    if (!els.length) return void console.warn('Modal Gallery cannot be initialised, no images found');

    return els.map(el => create([{
        trigger: el,
        src: el.getAttribute('href'),
        srcset: el.getAttribute('data-srcset') || null,
        sizes: el.getAttribute('data-sizes') || null,
        title: el.getAttribute('data-title') || '',
        description: el.getAttribute('data-description') || ''
    }], opts));
};

export const galleries = (src, opts) => {
    let els = getSelection(src);
    if (!els.length) return void console.warn('Modal Gallery cannot be initialised, no images found');
		
    let items = els.map((el) => {
        return (el instanceof HTMLElement) ? {
            trigger: el,
            src: el.getAttribute('href'),
            srcset: el.getAttribute('data-srcset') || null,
            sizes: el.getAttribute('data-sizes') || null,
            title: el.getAttribute('data-title') || '',
            description: el.getAttribute('data-description') || ''
        } : el;
    });

    return create(items, opts);
};
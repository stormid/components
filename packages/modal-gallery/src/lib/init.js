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
    let nodes = [];

    if(typeof selector === "string") {
        nodes = [].slice.call(document.querySelectorAll(selector));
    } else if (selector instanceof Array) {
        nodes = selector;
    } else if (Object.prototype.isPrototypeOf.call(NodeList.prototype, selector)) {
        nodes = [].slice.call(selector);
    } else if (selector instanceof HTMLElement) {
        nodes.push(selector)
    }

    return nodes;
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
import factory from './lib/factory';
import defaults from './lib/defaults';

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

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 */
export default (selector, options) => {
    //Array.from isnt polyfilled
    //https://github.com/babel/babel/issues/5682
    let nodes = getSelection(selector);
	
    return nodes.reduce((acc, el) => {
        if (!el.hasAttribute('novalidate')) {
            acc.push(Object.create(factory(el, { ...defaults, ...options })));
            el.setAttribute('novalidate', 'novalidate');
        }
        return acc;
    }, []);

};
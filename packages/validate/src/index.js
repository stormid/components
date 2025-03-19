import factory from './lib/factory';
import defaults from './lib/defaults';
import { getSelection } from './lib/validator/utils';

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 */
export default (selector, options) => {
    let nodes = getSelection(selector);
	
    return nodes.reduce((acc, el) => {
        if (!el.hasAttribute('novalidate')) {
            acc.push(Object.create(factory(el, { ...defaults, ...options })));
            el.setAttribute('novalidate', 'novalidate');
        }
        return acc;
    }, []);

};
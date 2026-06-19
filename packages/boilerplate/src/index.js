import defaults from './lib/defaults.js';
import factory from './lib/factory.js';
import { getSelection } from './lib/utils.js';

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 */
export default (selector, options) => {
    let nodes = getSelection(selector);

    //no DOM nodes found, return with warning
    if (nodes.length === 0) return void console.warn(`boilerplate not initialised, no elements found for selector '${selector}'`);
    
    //return array of objects, one for each DOM node found
    //settings precedence: each spread overrides the previous, so node.dataset (data-* attributes)
    //wins over options passed to init, which win over defaults
    //...node.dataset is optional - remove it if this component does not read data-* config
    return nodes.map(node => Object.create(factory({
        settings: { ...defaults, ...options, ...node.dataset },
        node
    })));
};
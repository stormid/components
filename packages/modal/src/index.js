import defaults from './lib/defaults.js';
import factory from './lib/factory.js';
import { getSelection, coerceSettings } from './lib/utils.js';

/*
 * Returns an array of modal instances augmenting DOM elements that match a selector
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 *
 * @return Array of modal instances, one for each DOM node found (empty Array if none found)
 */
export default (selector, options) => {
    const nodes = getSelection(selector);

    if (nodes.length === 0) {
        console.warn(`Modal not initialised, no elements found for selector '${selector}'`);
        return []; // return an empty Array so callers can safely destructure the result
    }

    //return an Array of instances, one for each DOM node found
    //each instance exposes getState/open/close/destroy, with settings composed from
    //defaults, data-attributes on the node, and options passed to init (coerced to their intended types)
    return nodes.map(node => factory({
        settings: coerceSettings({ ...defaults, ...node.dataset, ...options }),
        node
    }));
};
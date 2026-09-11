import defaults from './lib/defaults.js';
import factory from './lib/factory.js';
import { getSelection } from './lib/utils.js';

/*
 * Returns a single instance that spies on every DOM element matching the selector,
 * or undefined (with a warning) if none match.
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList, an HTMLCollection or a single DOM element.
 * @param options, Object, merged with defaults to become the settings of the instance
 */
export default (selector, options) => {
    const nodes = getSelection(selector);

    //no DOM nodes found, return with warning
    if (nodes.length === 0) return void console.warn(`Scroll spy not initialised for selector '${selector}'`);

    //one instance manages all matched nodes together, since the active-state logic is cross-node
    return Object.create(factory({
        settings: { ...defaults, ...options },
        nodes
    }));
};
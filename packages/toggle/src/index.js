import defaults from './lib/defaults.js';
import factory from './lib/factory.js';
import { getSelection, coerceSettings, BOOLEAN_SETTINGS, NUMBER_SETTINGS } from './lib/utils.js';

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList, an HTMLCollection or a single DOM element.
 * @params options, Object, to be merged with defaults to become the settings property of each returned object
 *
 * @return Array of toggle instances, one for each DOM node found (empty Array if none found)
 */
export default (selector, options) => {
    const nodes = getSelection(selector);

    if (nodes.length === 0) {
        console.warn(`Toggle not initialised, no elements found for selector '${selector}'`);
        return []; // return an empty Array so callers can safely destructure the result
    }

    //return an Array of instances, one for each DOM node found
    //each instance exposes node/startToggle/toggle/getState/destroy, with settings composed from
    //defaults, options passed to init, and data-attributes on the node (coerced to their intended types).
    //data-attributes are applied last so a single init call can be tuned per node
    return nodes.map(node => {
        const settings = coerceSettings({ ...defaults, ...options, ...node.dataset }, { booleans: BOOLEAN_SETTINGS, numbers: NUMBER_SETTINGS });
        //data-toggle identifies the trigger elements, so it is structural markup rather than
        //configuration and is dropped rather than carried into settings as `toggle`
        delete settings.toggle;
        return factory({ settings, node });
    });
};

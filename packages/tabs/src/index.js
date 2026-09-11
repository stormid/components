import defaults from './lib/defaults.js';
import factory from './lib/factory.js';
import { getSelection, coerceSettings, BOOLEAN_SETTINGS, NUMBER_SETTINGS } from './lib/utils.js';

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 */
export default (selector, options) => {
    let nodes = getSelection(selector);

    if (nodes.length === 0) {
        console.warn(`Tabs not initialised, no elements found for selector '${selector}'`);
        return []; // return an empty Array so callers can safely destructure the result
    }

    //return array of Objects, one for each DOM node found
    //each Object has a prototype consisting of the node (HTMLElement), and a settings property composed
    //from defaults, options passed to init, and data-attributes on the node (coerced to their intended
    //types). data-attributes are applied last so a single init call can be tuned per node
    return nodes.map(node => {
        const instance = factory({
            settings: coerceSettings({ ...defaults, ...options, ...node.dataset }, { booleans: BOOLEAN_SETTINGS, numbers: NUMBER_SETTINGS }),
            node
        });
        return instance ? Object.create(instance) : void console.warn('Tab not initialised, required markup not found');
    }).filter(instance => typeof instance !== 'undefined');
};
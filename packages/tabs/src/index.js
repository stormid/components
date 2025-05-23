import defaults from './lib/defaults';
import factory from './lib/factory';
import { getSelection } from './lib/utils';

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 */
export default (selector, options) => {
    let nodes = getSelection(selector);

    if (nodes.length === 0) return console.warn(`Tabs not initialised, no elements found for selector '${selector}'`);
   
    //return array of Objects, one for each DOM node found
    //each Object has a prototype consisting of the node (HTMLElement),
    //and a settings property composed from defaults, data-attributes on the node, and options passed to init
    return nodes.map(node => {
        const instance = factory({
            settings: { ...defaults, ...node.dataset, ...options },
            node
        });
        return instance ? Object.create(instance) : void console.warn('Tab not initialised, required markup not found');
    }).filter(instance => typeof instance !== 'undefined');
};
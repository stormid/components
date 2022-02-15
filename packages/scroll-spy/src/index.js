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
    //Array.from isnt polyfilled
    //https://github.com/babel/babel/issues/5682
    let nodes = getSelection(selector);

    //no DOM nodes found, return with warning
    if (nodes.length === 0) return void console.warn(`Scroll spy not initialised for selector '${selector}'`);
    
    //return array of objects, one for each DOM node found
    return Object.create(factory({
        settings: { ...defaults, ...options },
        nodes
    }));
};
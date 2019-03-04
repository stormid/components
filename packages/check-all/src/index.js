import defaults from './lib/defaults';
import factory from './lib/factory';

/* 
 * Returns an array of objects augmenting DOM elements that match a selector
 * 
 * @param selector, String, A DOMString containing one or more selectors to match, must be a valid CSS selector string
 * @params options, Object, to be merged with defaults to become the settings property of each returned object, all options can also be set on a node as a data-attrbute
 */
const init = (selector, options) => {
   //Array.from isnt polyfilled
   //https://github.com/babel/babel/issues/5682
   const nodes = Array.from(document.querySelectorAll(selector));

   //no DOM nodes found, return with warning
   if(nodes.length === 0) return console.warn(`Tabs not initialised, no elements found for selector '${sel}'`);
   
   //return array of Objects, one for each DOM node found
   //each Object has a prototype consisting of the node (HTMLElement),
   //and a settings property composed from defaults, data-attributes on the node, and options passed to init
   return nodes.map(node => Object.create(factory({ 
		settings: { ...defaults, ...node.dataset, ...options },
		node
	})));
};

/*
 * Component API
 */
export default { init };
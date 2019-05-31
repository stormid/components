import defaults from './lib/defaults';
import factory from './lib/factory';
import { validateUUID } from './lib/utils'; 

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 * 
 * @param selector, String, A DOMString containing one or more selectors to match, must be a valid CSS selector string
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 */
const init = (tid, options) => {

	//no DOM nodes found, return with warning
	if(!validateUUID(tid)) return console.warn(`Measure not initialised, invalid tracking Id`);
    
	//return array of objects, one for each DOM node found
	return factory({
		settings: { ...defaults, ...options },
		tid
	});
};
/*
 * Component API
 */
export default { init };
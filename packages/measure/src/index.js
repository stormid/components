import defaults from './lib/defaults';
import factory from './lib/factory';

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 * 
 * @param selector, String, A DOMString containing one or more selectors to match, must be a valid CSS selector string
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 */
const init = (tid, options = {}) => {
	//no DOM nodes found, return with warning
	if(!tid) return console.warn(`Measure not initialised, missing tracking Id`);
    
	//return Measure Object
	return factory({
		parameters: Object.assign({}, { tid }, options.parameters ? Object.assign({}, defaults.parameters, options.parameters) : defaults.parameters),
		custom: options.custom,
		settings: options.settings ? Object.assign({}, defaults.settings, options.settings) : defaults.settings
	});
};

export default { init };
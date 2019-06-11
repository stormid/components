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
	//;_; reeeeeefactor
	return factory({
		settings: { ...defaults.settings, ...(options.settings ? options.settings: {}) },
		data: { tid, ...defaults.data, ...(options.data ? options.data: {}) }
	});
};

export default { init };
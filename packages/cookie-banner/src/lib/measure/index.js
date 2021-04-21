import factory from './lib/factory';

/*
 * Returns an array of objects augmenting DOM elements that match a selector
 *
 * @param tid, String, tracking Id for the corresponding Google Analytics container
 * @params options, Object, to be merged with defaults to become the settings propery of each returned object
 */
const init = (tid, options = {}) => {
	//no DOM nodes found, return with warning
	if (!tid) return console.warn(`Measure not initialised, missing tracking Id`);
	//return Measure Object
	return factory({
		parameters: Object.assign({}, { tid }, options.parameters ? Object.assign({}, options.parameters) : {})
	});
};

export default { init };
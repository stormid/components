import defaults from './lib/defaults';
import factory from './lib';

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));

	if(!els.length) return console.warn('No check all inputs found');
    
	return els.map(el => Object.create(factory(el, Object.assign({}, defaults, opts))));
};

export default { init };
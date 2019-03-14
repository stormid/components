import defaults from './lib/defaults';
import factory from './lib';

const init = (sel, opts) => {
	const els = [].slice.call(document.querySelectorAll(sel));

	if(!els.length) return console.warn('No table row links found');
    
	return els.map(el => Object.create(factory(el, Object.assign({}, defaults, opts))));
};

export default { init };
import defaults from './lib/defaults';

const update = ({ target }) => {
	target.style.height = 'auto';
	target.style.height = `${target.scrollHeight}px`;
}

const init = (els, options) => {
	if (typeof els === 'string') {
		els = document.querySelectorAll(els);
	}
	const events = options && options.events || defaults.events;
	for (const element of els) {
		for (const event of events) {
			element.addEventListener(event, update);
		}
		update({ target: element });
	}
};

export default { init };
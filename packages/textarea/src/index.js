import defaults from './lib/defaults';

const isHidden = el => el.offsetParent === null;

	  
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
		if(isHidden(element)) initObserver(element);
		update({ target: element });
	}
};

const initObserver = el => {
	const observer = new MutationObserver(mutationsList => {
		update({ target: el });
	});
	observer.observe(el.parentNode, { attributes: true, attributeOldValue: true, attributeFilter: ['class']  });
};

export default { 
	init,
	resize() {
		update({ target: element })
	}
};
import defaults from './defaults/';
import factory from './factory';

const create = (items, options) => Object.create(factory({
	items: items,
	settings: { ...defaults, ...options }
}))

export const singles = (src, opts) => {
	let els = [].slice.call(document.querySelectorAll(src));

	if (!els.length) return void console.warn('Modal Gallery cannot be initialised, no images found');

	return els.map(el => create([{
		trigger: el,
		src: el.getAttribute('href'),
		srcset: el.getAttribute('data-srcset') || null,
		sizes: el.getAttribute('data-sizes') || null,
		title: el.getAttribute('data-title') || '',
		description: el.getAttribute('data-description') || ''
	}], opts));
};

export const galleries = (src, opts) => {
	let items;

	if (typeof src === 'string'){
		const els = [].slice.call(document.querySelectorAll(src));

		if(!els.length) return void console.warn('Modal Gallery cannot be initialised, no images found');
		
		items = els.map(el => {
			return {
				trigger: el,
				src: el.getAttribute('href'),
				srcset: el.getAttribute('data-srcset') || null,
				sizes: el.getAttribute('data-sizes') || null,
				title: el.getAttribute('data-title') || '',
				description: el.getAttribute('data-description') || ''
			};
		});
	} else items = src;

	return create(items, opts);
};
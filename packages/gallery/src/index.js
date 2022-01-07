import defaults from './lib/defaults';
import factory from './lib/factory';

export default (src, options) => {
    if (!src.length) return void console.warn('Gallery cannot be initialised, no images found');

    let items;

    if (typeof src === 'string'){
        const els = [].slice.call(document.querySelectorAll(src));

        if (!els.length) return void console.warn('Gallery cannot be initialised, no images found');
		
        items = els.map(el => ({
            src: el.getAttribute('href'),
            srcset: el.getAttribute('data-srcset') || null,
            sizes: el.getAttribute('data-sizes') || null,
            title: el.getAttribute('data-title') || '',
            description: el.getAttribute('data-description') || ''
        }));
    } else items = src;

    return Object.create(factory({
        items,
        settings: { ...defaults, ...options }
    }));
};
import defaults from './lib/defaults';
import factory from './lib/factory';

export default (selector, options) => {
    const galleries = [].slice.call(document.querySelectorAll(selector));
    if (galleries.length === 0) return void console.warn('Gallery cannot be initialised, no galleries found');
    
    return galleries.map(gallery => Object.create(factory(gallery, { ...defaults, ...options })));
};
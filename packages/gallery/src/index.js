import defaults from './lib/defaults';
import factory from './lib/factory';
import { getSelection } from './lib/utils';

export default (selector, options) => {
    const galleries = getSelection(selector);
    if (galleries.length === 0) return void console.warn(`Gallery not initialised, no elements found for selector '${selector}'`);
    
    return galleries.map((gallery, index) => Object.create(factory(gallery, { ...defaults, ...options }, index)));
};
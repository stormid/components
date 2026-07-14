import defaults from './lib/defaults.js';
import factory from './lib/factory.js';

export default opts => factory(Object.assign({}, defaults, opts));
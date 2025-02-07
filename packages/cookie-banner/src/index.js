import defaults from './lib/defaults';
import factory from './lib/factory';

export default opts => factory(Object.assign({}, defaults, opts));
import defaults from './lib/defaults';
import factory from './lib';

export default {
    init: (sel, opts) => Object.assign({}, factory(sel, Object.assign({}, defaults, opts)))
};
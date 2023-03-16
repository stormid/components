import defaults from './lib/defaults';
import factory from './lib/factory';

/*
 * Returns a instance
 *
 * @params options, Object, to be merged with defaults to become the settings propery of the instance
 */
export default async (tid, options) => {
    if (!tid) return console.warn(`GA4: Missing tracking Id`);
    return Object.create(await factory({
        tid,
        settings: { ...defaults, ...options }
    }));
};
import { createStore } from '../store';
import { initial, add } from '../reducers';
import { event } from '../shared/compose';
import { send } from '../protocol';

/*
 * @param options, Object, merged defaults + options passed in as instantiation config to module default
 */
export default options => {
	const Store = createStore();
	const persistent = options ? options.parameters : {};

	Store.dispatch(initial, {
		persistent: persistent
	});
	
	return {
		getState: Store.getState,
		event(data, href) {
			Store.dispatch(add, event(data), [ send(Store, 'event'), () => {if(href) document.location = href} ]);
		}
	};
};
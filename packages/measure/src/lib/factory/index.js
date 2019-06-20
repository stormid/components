import { createStore } from '../store';
import { initial, add } from '../reducers';
import { clientId, systemInfo, documentInfo } from '../utils/data';
import { stateFromOptions, event, ecommerce } from '../utils/compose';
import { send, links } from '../protocol';

/*
 * @param options, Object, merged defaults + options passed in as instantiation config to module default
 */
export default options => {
	const Store = createStore();
	const { settings, parameters} = stateFromOptions(options);
	const { persistent, stack } = parameters;

	Store.dispatch(initial, {
		settings,
		persistent: {
			...persistent,
			...systemInfo(),
			...documentInfo(),
			cid: clientId(options)
		},
		stack
	}, [ send(Store), links(Store) ]);
	
	return {
		getState: Store.getState,
		event(data) {
			Store.dispatch(add, event(data), [ send(Store, 'event') ]);
		},
		ecommerce(data) {
			console.log(ecommerce(data));
		}
	};
};
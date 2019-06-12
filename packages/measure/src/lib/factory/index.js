import { createStore } from '../store';
import { initial, add } from '../reducers';
import { clientId, systemInfo, documentInfo, stateFromOptions, composeEvent } from '../utils';
import { send } from '../protocol';

/*
 * @param options, Object, merged defaults + options passed in as instantiation config to module default
 */
export default options => {
	const Store = createStore();
	const { persistent, stack } = stateFromOptions(options);

	Store.dispatch(initial, {
		persistent: {
			...persistent,
			...systemInfo(),
			...documentInfo(),
			cid: clientId(options)
		},
		stack
	}, [ send(Store) ]);
	
	return {
		getState: Store.getState,
		event(data) {
			Store.dispatch(add, composeEvent(data), [ send(Store, 'event') ]);
		}
	};
};
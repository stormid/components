import { createStore } from '../store';
import { initial, add } from '../reducers';
import { clientId, systemInfo, documentInfo } from '../utils/data';
import { stateFromOptions, event, impression, action } from '../utils/compose';
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
		ecommerce: {
			impression(data) {
				Store.dispatch(add, impression(data, Store.getState()), [ send(Store, 'event') ]);
			},
			action(data){
				console.log(data);
				console.log(action(data, Store.getState()));
				Store.dispatch(add, action(data, Store.getState()), [ send(Store, 'event') ]);
			}
		}
	};
};

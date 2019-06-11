import { createStore } from '../store';
import { initialState } from '../reducers';
import { clientId, systemInfo, documentInfo } from '../utils';
import { send } from '../protocol';

/*
 * 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param Google Property Tracking Id, String
 */
export default ({ settings, data }) => {
	const Store = createStore();
	Store.dispatch(initialState, { settings, data: { 
		...data,
		...systemInfo(),
		...documentInfo(),
		cid: clientId(settings)
	} }, [ send() ]);
	
	return { getState: Store.getState };
};
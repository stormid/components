import { createStore } from './store';
import { findSpies, setActive, unsetAllActive, unsetActive, findActive } from './dom';
import { addActive, removeActive } from './reducers';

export const callback = (Store, spy) => (entries, observer) => {
	const { settings, active } = Store.getState();
	if(entries[0].isIntersecting) {
		if(settings.single) Store.dispatch(addActive(Store.getState(), spy), [ unsetAllActive, setActive(spy) ]);
		else Store.dispatch(addActive(Store.getState(), spy), [ setActive(spy) ]);
	} else {
		if(active.length === 0) return;
		if(settings.single) Store.dispatch(removeActive(Store.getState(), spy), [ unsetActive(spy), findActive ]);
		else Store.dispatch(removeActive(Store.getState(), spy), [ unsetActive(spy) ]);
	} 
};

const initObservers = Store => state => {
	const { settings, spies } = Store.getState();
	spies.map(spy => {
		if(spy === undefined) return;
		const observer = new IntersectionObserver(callback(Store, spy), {
			root: settings.root,
			rootMargin: settings.rootMargin,
			threshold: settings.threshold
		});
		observer.observe(spy.target);
	});
};

export default ({ settings, nodes }) => {
	const Store = createStore();
	Store.dispatch({ spies: findSpies(nodes), settings, active: [] }, [ initObservers(Store) ]);
	
	return {
		getState: Store.getState
	}
};
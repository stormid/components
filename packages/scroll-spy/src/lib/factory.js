import { createStore } from './store';
import { findSpies, setActive, unsetAllActive, unsetActive, findActive } from './dom';
import { addActive, removeActive } from './reducers';

export const callback = (store, spy) => (entries, observer) => {
    const { settings, active } = store.getState();
    if (entries[0].isIntersecting) {
        if (settings.single) store.update(addActive(store.getState(), spy), [ unsetAllActive, setActive(spy) ]);
        else store.update(addActive(store.getState(), spy), [ setActive(spy) ]);
    } else {
        if (active.length === 0) return;
        if (settings.single) store.update(removeActive(store.getState(), spy), [ unsetActive(spy), findActive ]);
        else store.update(removeActive(store.getState(), spy), [ unsetActive(spy) ]);
    }
};

const initObservers = store => state => {
    const { settings, spies } = store.getState();
    spies.map(spy => {
        if (spy === undefined) return;
        const observer = new IntersectionObserver(callback(store, spy), {
            root: settings.root,
            rootMargin: settings.rootMargin,
            threshold: settings.threshold
        });
        observer.observe(spy.target);
    });
};

export default ({ settings, nodes }) => {
    const store = createStore();
    store.update({ spies: findSpies(nodes), settings, active: [] }, [ initObservers(store) ]);
	
    return {
        getState: store.getState
    };
};
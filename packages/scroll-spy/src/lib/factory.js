import { createStore } from './store';
import { findSpies, setActive } from './dom';
import { addActive, removeActive, setScrolled } from './reducers';

export const intersectionCallback = (store, spy) => (entries, observer) => {
    (entries[0].isIntersecting) ? store.update(addActive(store.getState(), spy), [ setActive() ]) :  store.update(removeActive(store.getState(), spy), [ setActive() ]);   
};

export const scrollCallback = store => () => {
    const rest = document.documentElement.scrollHeight - document.documentElement.scrollTop;
    (Math.abs(document.documentElement.clientHeight - rest) < 1) ? store.update(setScrolled(store.getState(), true), [setActive()]) : store.update(setScrolled(store.getState(), false), []);
}

export const initObservers = store => state => {
    const { settings, spies } = store.getState();

    spies.map(spy => {
        if (spy === undefined) return;
        const observer = new IntersectionObserver(intersectionCallback(store, spy), {
            root: settings.root,
            rootMargin: settings.rootMargin,
            threshold: settings.threshold
        });
        observer.observe(spy.target);
    });

    window.onscroll = scrollCallback(store);
};

export default ({ settings, nodes }) => {
    const store = createStore();
    store.update({ spies: findSpies(nodes), settings, active: [], hasScrolled: false}, [ initObservers(store) ]);
	
    return {
        getState: store.getState
    };
};
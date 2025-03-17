import { createStore } from './store';
import { findSpies, setActive } from './dom';
import { setDirection, addActive, removeActive, setScrolled } from './reducers';

export const callback = (store, spy) => (entry) => {
    store.update(setDirection(store.getState(), entry.scrollDirectionY), [() => {
        (entry.isIntersecting) ? store.update(addActive(store.getState(), spy), [ setActive() ]) :  store.update(removeActive(store.getState(), spy), [ setActive() ]);
    }]);
};

export const createIntersectionObserver = (callback, opts) => {
    var previousY = new Map();
    var observer = new IntersectionObserver(function(entries, observer){
        entries.forEach(function (entry) {
            var currY = entry.boundingClientRect.y;
            var prevY = previousY.get(entry.target);
            entry.scrollDirectionY = (currY > prevY) ? 'up' : 'down';
            callback(entry);
            previousY.set(entry.target, currY);
        });
    }, opts)
  
    return observer;
}

export const initObservers = store => state => {
    const { settings, spies } = store.getState();
    spies.map(spy => {
        if (spy === undefined) return;
        const observer = createIntersectionObserver(callback(store, spy), {
            root: settings.root,
            rootMargin: settings.rootMargin,
            threshold: settings.threshold
        });
        observer.observe(spy.target);
    });

    window.onscroll = () => {
        store.update(setScrolled(store.getState(), true), []);
    }

};

export default ({ settings, nodes }) => {
    const store = createStore();
    store.update({ spies: findSpies(nodes), settings, active: [], hasScrolled: false, scrollDirectionY: 'down'}, [ initObservers(store) ]);
	
    return {
        getState: store.getState
    };
};
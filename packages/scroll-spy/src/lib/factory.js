import { createStore } from './store';
import { findSpies, setActive } from './dom';
import { addActive, removeActive, setScrolled } from './reducers';

export const intersectionCallback = (store, spy) => (entries, observer) => {
    //check if the interstion has happened.  If the element is visible, it's a candidate for being active.
    (entries[0].isIntersecting) ? store.update(addActive(store.getState(), spy), [ setActive() ]) :  store.update(removeActive(store.getState(), spy), [ setActive() ]);   
};

export const scrollCallback = store => () => {
    //Check if the scroll position has hit the bottom of the window.  Set a flag in the store to indicate this.
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

    let throttleTick = false;
    window.addEventListener('scroll', () => {
        if (!throttleTick) {
            window.requestAnimationFrame(() => {
                scrollCallback(store)();
                throttleTick = false;
            });
            throttleTick = true;
        }
    });
};

export default ({ settings, nodes }) => {
    const store = createStore();
    store.update({ spies: findSpies(nodes), settings, active: [], hasScrolledToBottom: false}, [ initObservers(store) ]);
	
    return {
        getState: store.getState
    };
};
import { createStore } from './store.js';
import { findSpies, setActive } from './dom.js';
import { addActive, removeActive, setScrolled } from './reducers.js';
import { rafThrottle } from './utils.js';

export const intersectionCallback = (store, spy) => entries => {
    //check if the intersection has happened.  If the element is visible, it's a candidate for being active.
    (entries[0].isIntersecting) ? store.update(addActive(store.getState(), spy), [ setActive(store) ]) : store.update(removeActive(store.getState(), spy), [ setActive(store) ]);
};

export const scrollCallback = store => () => {
    //Check if the scroll position has hit the bottom of the window.  Set a flag in the store to indicate this.
    const rest = document.documentElement.scrollHeight - document.documentElement.scrollTop;
    (Math.abs(document.documentElement.clientHeight - rest) < 1) ? store.update(setScrolled(store.getState(), true), [ setActive(store) ]) : store.update(setScrolled(store.getState(), false), [ setActive(store) ]);
};

export const initObservers = store => () => {
    const { settings, spies } = store.getState();

    const observers = spies.map(spy => {
        const observer = new IntersectionObserver(intersectionCallback(store, spy), {
            root: settings.root,
            rootMargin: settings.rootMargin,
            threshold: settings.threshold
        });
        observer.observe(spy.target);
        return observer;
    });

    //A single, stable handler so the listener can be removed again in destroy()
    const scrollHandler = rafThrottle(scrollCallback(store));
    window.addEventListener('scroll', scrollHandler);

    store.update({ ...store.getState(), observers, scrollHandler });
};

export default ({ settings, nodes }) => {
    const store = createStore();
    store.update({ spies: findSpies(nodes), settings, active: [], hasScrolledToBottom: false, observers: [], scrollHandler: null }, [ initObservers(store) ]);

    return {
        getState: store.getState,
        destroy() {
            const { observers, scrollHandler, spies } = store.getState();
            observers.forEach(observer => observer.disconnect());
            if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
            spies.forEach(spy => {
                spy.node.classList.remove(settings.activeClassName);
                spy.node.removeAttribute('aria-current');
            });
        }
    };
};

import { createStore } from './store.js';
import { findSpies, setActive } from './dom.js';
import { addActive, removeActive, setScrolled } from './reducers.js';
import { rafThrottle } from './utils.js';

export const intersectionCallback = (store, spy) => entries => {
    if (store.getState().destroyed) return;
    //Use the most recent record: the observer can deliver several queued records for one target
    //when visibility flips more than once between frames, and only the last reflects current state.
    (entries[entries.length - 1].isIntersecting) ? store.update(addActive(store.getState(), spy), [ setActive(store) ]) : store.update(removeActive(store.getState(), spy), [ setActive(store) ]);
};

export const scrollCallback = store => () => {
    //A queued animation frame can fire after destroy(); bail so setActive can't re-apply classes.
    if (store.getState().destroyed) return;
    //Measure the actual scroll container. For a custom `root` element the document metrics are
    //unrelated (and its scroll events don't reach window), so read from the root when one is set.
    const el = store.getState().settings.root || document.documentElement;
    const rest = el.scrollHeight - el.scrollTop;
    (Math.abs(el.clientHeight - rest) < 1) ? store.update(setScrolled(store.getState(), true), [ setActive(store) ]) : store.update(setScrolled(store.getState(), false), [ setActive(store) ]);
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

    //A single, stable handler so the listener can be removed again in destroy(). Listen on the
    //custom root when one is set (its scroll events don't bubble to window), else on window.
    const scrollHandler = rafThrottle(scrollCallback(store));
    (settings.root || window).addEventListener('scroll', scrollHandler);

    store.update({ ...store.getState(), observers, scrollHandler });
};

export default ({ settings, nodes }) => {
    const store = createStore();
    store.update({ spies: findSpies(nodes), settings, active: [], hasScrolledToBottom: false, observers: [], scrollHandler: null, destroyed: false }, [ initObservers(store) ]);

    return {
        getState: store.getState,
        destroy() {
            const { observers, scrollHandler, spies } = store.getState();
            //flag first so any animation frame already queued by the throttled scroll handler bails
            store.update({ ...store.getState(), destroyed: true });
            observers.forEach(observer => observer.disconnect());
            if (scrollHandler) (settings.root || window).removeEventListener('scroll', scrollHandler);
            spies.forEach(spy => {
                spy.node.classList.remove(settings.activeClassName);
                spy.node.removeAttribute('aria-current');
            });
        }
    };
};

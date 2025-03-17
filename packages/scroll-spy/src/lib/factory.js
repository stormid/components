import { createStore } from './store';
import { findSpies, setActive, unsetAllActive, unsetActive, findActive } from './dom';
import { setDirection, addActive, removeActive } from './reducers';

export const callback = (store, spy) => (entry, observer, entries) => {
    const { settings, active } = store.getState();

    store.update(setDirection(store.getState(), entry.scrollDirectionY), []);

    if (entry.isIntersecting) {
        if (settings.single) store.update(addActive(store.getState(), spy), [ unsetAllActive, setActive(spy) ]);
        else store.update(addActive(store.getState(), spy), [ setActive(spy) ]);
    } else {
        if (active.length === 0) return;
        if (settings.single) store.update(removeActive(store.getState(), spy), [ unsetActive(spy), findActive ]);
        else store.update(removeActive(store.getState(), spy), [ unsetActive(spy) ]);
    }
};


function createIntersectionObserver(callback, opts) {
    var previousY = new Map();
  
    var observer = new IntersectionObserver(function(entries, observer){
        

        entries.forEach(function (entry) {
            entry.scrollDirectionY = 'down';

            var currY = entry.boundingClientRect.y;
            var prevY = previousY.get(entry.target);

            if(currY>prevY) { entry.scrollDirectionY = 'up'; }
            
            callback(entry, observer, entries);
            previousY.set(entry.target, currY);
        });
    }, opts)
  
    return observer;
}


const initObservers = store => state => {
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
};

export default ({ settings, nodes }) => {
    const store = createStore();
    store.update({ spies: findSpies(nodes), settings, active: [], scrollDirectionY: 'down'}, [ initObservers(store) ]);
	
    return {
        getState: store.getState
    };
};
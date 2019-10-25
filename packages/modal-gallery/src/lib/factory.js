import { createStore } from './store';
import { initTriggers, keyListener, open } from './dom';

/* 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param items, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Modal Gallery API
 */
export default ({ items, settings }) => {
    const Store = createStore();
    Store.dispatch({
        settings,
        items,
        imageCache: [],
        isOpen: false,
        current: null,
        keyListener: keyListener(Store)
    }, [ initTriggers(Store) ]);

    return {
        getState: Store.getState,
        open: open(Store)
    }
}; 
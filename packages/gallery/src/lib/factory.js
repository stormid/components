import { createStore } from './store';
import { initUI, toggleFullScreen } from './dom';

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
        current: settings.start,
        isFullScreen: false
    }, [ initUI(Store) ]);

    return {
        getState: Store.getState,
        toggleFullScreen: toggleFullScreen.bind(null, Store)
    };
};
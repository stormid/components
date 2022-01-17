import { createStore } from './store';
import { init, toggleFullScreen, goTo } from './dom';
import { composeItems, composeDOM, getIndexFromURL, popstateHandler } from './utils';

/* 
 * @param node, HTMLElement, DOM node containing the gallery
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 *
 * @returns Object, Gallery API: getState, initialise (for deferred or manual initialisation), gotTo, toggleFullScreen
 */
export default (node, settings, index) => {
    const Store = createStore();

    const items = [].slice.call(node.querySelectorAll(settings.selector.item));
    if (items.length === 0) return console.warn('Gallery cannot be initialised, no items found'), null;

    const name = `gallery-${index + 1}`;
    Store.dispatch({
        node,
        name,
        settings,
        items: composeItems(items, settings),
        dom: composeDOM(node, settings),
        activeIndex: getIndexFromURL(name, items, location.hash, settings.startIndex)
    }, [
        () => !settings.manualInitialisation && init(Store)(),
        () => window.addEventListener('popstate', popstateHandler(Store))
    ]);

    return {
        getState: Store.getState,
        initialise: init(Store),
        goTo: goTo(Store),
        toggleFullScreen: toggleFullScreen.bind(null, Store)
    };
};
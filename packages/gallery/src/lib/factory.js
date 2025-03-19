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
    const store = createStore();

    const items = [].slice.call(node.querySelectorAll(settings.selector.item));
    if (items.length === 0) return console.warn('Gallery cannot be initialised, no items found'), null;

    const name = `${settings.name || node.getAttribute('id') || 'gallery'}-${index + 1}`;

    store.update({
        node,
        name,
        settings,
        items: composeItems(items, settings),
        dom: composeDOM(node, settings),
        activeIndex: getIndexFromURL(name, items, location.hash, settings.startIndex)
    }, [
        () => !settings.manualInitialisation && init(store)(),
        () => window.addEventListener('popstate', popstateHandler(store))
    ]);

    return {
        getState: store.getState,
        initialise: init(store),
        goTo: goTo(store),
        toggleFullScreen: toggleFullScreen.bind(null, store)
    };
};
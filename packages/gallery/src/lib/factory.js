import { createStore } from './store';
import { init, toggleFullScreen, goTo } from './dom';
import { composeDOM, getIndexFromURL, hashchangeHandler } from './utils';

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

    //ensure each gallery item has an id
    //need to do this before setting initial state as it's required for the initial activeIndex
    //TODO
    // - add a check for duplicate ids across whole document if multiple galleries initialised separately
    items.forEach((item, idx) => {
        if (!item.hasAttribute('id')) item.setAttribute('id', `gallery-${index + 1}-${idx + 1}`);
    });
    store.update({
        node,
        settings,
        items,
        dom: composeDOM(node, settings),
        activeIndex: getIndexFromURL(items, location.hash, settings.startIndex)
    }, [
        () => !settings.manualInitialisation && init(store)(),
        () => window.addEventListener('hashchange', hashchangeHandler(store))
    ]);

    return {
        getState: store.getState,
        initialise: init(store),
        goTo: goTo(store),
        toggleFullScreen: toggleFullScreen.bind(null, store)
    };
};
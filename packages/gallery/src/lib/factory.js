import { createStore } from './store';
import { init, toggleFullScreen, goTo } from './dom';
import { composeDOM, getIndexFromURL, hashchangeHandler, scrollHandler, patchIds, throttle } from './utils';

/* 
 * @param node, HTMLElement, DOM node containing the gallery
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 *
 * @returns Object, Gallery API: getState, initialise (for deferred or manual initialisation), gotTo, toggleFullScreen
 */
export default (node, settings, index) => {
    const store = createStore();

    let items = [].slice.call(node.querySelectorAll(settings.selector.item));
    if (items.length === 0) return console.warn('Gallery cannot be initialised, no items found'), null;

    //ensure each gallery item has an id
    //need to do this before setting initial state as it's required for the initial activeIndex
    items = patchIds(items, index);
    
    store.update({
        node,
        settings,
        items,
        list: node.querySelector(settings.selector.list),
        dom: composeDOM(node, settings),
        activeIndex: getIndexFromURL(items, location.hash, settings.startIndex)
    }, [
        () => !settings.manualInitialisation && init(store)(),
        () => window.addEventListener('hashchange', hashchangeHandler(store)),
        ({ list }) => list.addEventListener('scroll', throttle(scrollHandler(store), 160))
    ]);

    return {
        getState: store.getState,
        initialise: init(store),
        goTo: goTo(store),
        toggleFullScreen: toggleFullScreen.bind(null, store)
    };
};
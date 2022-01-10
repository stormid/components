import { createStore } from './store';
import { init, toggleFullScreen, goTo } from './dom';
import { composeItems, composeDOM } from './utils';

/* 
 * @param node, HTMLElement, DOM node containing the gallery
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 *
 * @returns Object, Gallery API
 */
export default (node, settings) => {
    const Store = createStore();

    const items = [].slice.call(node.querySelectorAll(settings.selector.item));
    if (items.length === 0) return void console.warn('Gallery cannot be initialised, no items found');

    Store.dispatch({
        node,
        settings,
        items: composeItems(items),
        dom: composeDOM(node, settings),
        activeIndex: settings.startIndex
    }, [ () => !settings.manualInitialisation && init(Store)() ]);

    return {
        getState: Store.getState,
        initialise: init(Store),
        goTo: goTo(Store),
        toggleFullScreen: toggleFullScreen.bind(null, Store)
    };
};
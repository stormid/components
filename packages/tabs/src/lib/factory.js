import { createStore } from './store';
import { findTabsAndPanels, initUI, open } from './dom';
import { getActiveIndexOnLoad } from './utils';

/* 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Toggle API
 */
export default ({ node, settings }) => {
    const Store = createStore();
    const { tabs, panels } = findTabsAndPanels(node, settings);
    const activeIndex = getActiveIndexOnLoad(panels, settings);
    Store.dispatch({
        settings,
        node,
        activeIndex: activeIndex !== undefined ? +activeIndex : +settings.activeIndex,
        activeTabIndex: activeIndex !== undefined ? +activeIndex : +settings.activeIndex,
        tabs,
        panels,
        loaded: false
    }, [ initUI(Store), open(Store) ]);

    return {
        getState: Store.getState
    };
};
import { createStore } from './store.js';
import { findTabsAndPanels, initUI, open } from './dom.js';
import { getActiveIndexOnLoad } from './utils.js';

/* 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Toggle API
 */
export default ({ node, settings }) => {
    const store = createStore();
    const { tabs, panels } = findTabsAndPanels(node, settings);
   
    if (!tabs.length || !panels.length || panels.includes(undefined)) return false;

    const activeIndex = getActiveIndexOnLoad(panels, node);
    store.update({
        settings,
        node,
        activeIndex: activeIndex !== undefined  ? +activeIndex : +settings.activeIndex,
        activeTabIndex: activeIndex !== undefined ? +activeIndex : +settings.activeIndex,
        tabs,
        panels,
        loaded: false
    }, [ initUI(store), open(store) ]);

    return {
        getState: store.getState
    };
};
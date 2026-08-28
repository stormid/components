import { createStore } from './store.js';
import { findTabsAndPanels, initUI, open, changePanel } from './dom.js';
import { getActiveIndexOnLoad, clampIndex } from './utils.js';

/*
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Tabs API
 */
export default ({ node, settings }) => {
    const store = createStore();
    const { tabs, panels } = findTabsAndPanels(node, settings);

    if (!tabs.length || !panels.length || panels.includes(undefined)) return false;

    const resolvedIndex = getActiveIndexOnLoad(panels, node);
    const activeIndex = clampIndex(resolvedIndex !== undefined ? +resolvedIndex : +settings.activeIndex, tabs.length);
    const controller = new AbortController();

    store.update({
        settings,
        node,
        activeIndex,
        activeTabIndex: activeIndex,
        tabs,
        panels,
        loaded: false,
        controller
    }, [ initUI(store), open(store) ]);

    return {
        getState: store.getState,
        goTo: (index, { focus = false } = {}) => {
            const state = store.getState();
            const target = clampIndex(+index, state.tabs.length);
            if (target === state.activeIndex) return;
            const previousIndex = state.activeIndex;
            //programmatic selection leaves focus where it is by default (pass { focus: true } to move it)
            store.update({ ...state, activeIndex: target, activeTabIndex: target }, [() => changePanel(store, previousIndex, focus)]);
        },
        destroy: () => store.getState().controller.abort()
    };
};

import { KEYCODES, MODES } from './constants';

/*
 * Returns an Object composed of two Array of HTMLElements - tabs and panels
 * 
 * @param node, HTMLElement, tab container
 * @param settings, Object, settings of the 
 * @return Object, tabs (Array of HTMLElement tab links), panels (Array of HTMLElement panel links)
 */
export const findTabsAndPanels = (node, settings) => {
    const tabs = [].slice.call(node.querySelectorAll(settings.tabSelector));
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('href').substr(1)) || console.warn(`Tab panel not found for ${tab}`));
    return { tabs, panels };
};
 
/*
 * Sets aria attributes and adds eventListener on each tab
 * 
 * @param store, Object, model or state of the current instance
 */
export const initUI = store => ({ tabs, panels }) => {
    tabs[0].parentNode.setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', false);
        panels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
        tab.setAttribute('tabindex', '-1');
        panels[i].setAttribute('role', 'tabpanel');
        panels[i].setAttribute('hidden', 'hidden');
        panels[i].setAttribute('tabindex', '-1');
        initListeners(tab, i, store);
        if (!panels[i].firstElementChild || panels[i].firstElementChild.hasAttribute('tabindex')) return;
        panels[i].firstElementChild.setAttribute('tabindex', '-1');
    });
};

const getPreviousTabIndex = ({ activeTabIndex, tabs }) => activeTabIndex === 0 ? tabs.length - 1 : activeTabIndex - 1;

const getNextTabIndex = ({ activeTabIndex, tabs }) => activeTabIndex === tabs.length - 1 ? 0 : activeTabIndex + 1;

const initListeners = (tab, nextIndex, store) => {
    const isManualActivation = store.getState().settings.activation === MODES.MANUAL;
    const onDirectionChangeFunction = (isManualActivation) ? () => focusTab(store) : changePanel;

    tab.addEventListener('keydown', e => {
        const previousIndex = store.getState().activeIndex;
        switch (e.keyCode) {
        case KEYCODES.LEFT:
            store.update({
                ...store.getState(),
                activeTabIndex: getPreviousTabIndex(store.getState()),
                activeIndex: (isManualActivation) ? store.getState().activeIndex : getPreviousTabIndex(store.getState())
            }, [() => onDirectionChangeFunction(store, previousIndex)]);
            break;
        case KEYCODES.RIGHT:
            store.update({
                ...store.getState(),
                activeTabIndex: getNextTabIndex(store.getState()) ,
                activeIndex: (isManualActivation) ? store.getState().activeIndex : getNextTabIndex(store.getState())
            }, [() => onDirectionChangeFunction(store, previousIndex)]);
            break;
        case KEYCODES.ENTER:
            (previousIndex !== nextIndex) && store.update({ ...store.getState(), activeIndex: nextIndex, activeTabIndex: nextIndex }, [() => changePanel(store, previousIndex)]);
            break;
        case KEYCODES.SPACE:
            e.preventDefault();
            (previousIndex !== nextIndex) && store.update({ ...store.getState(), activeIndex: nextIndex, activeTabIndex: nextIndex }, [() => changePanel(store, previousIndex)]);
            break;
        default:
            break;
        }
    });
    
    tab.addEventListener('click', e => {
        e.preventDefault();
        const previousActiveIndex = store.getState().activeTabIndex;
        store.getState().activeIndex !== nextIndex && store.update({
            ...store.getState(),
            activeIndex: nextIndex,
            activeTabIndex: nextIndex
        }, [() => changePanel(store, previousActiveIndex)]);
    }, false);
};

const changePanel = (store, previousActiveIndex) => {
    const { activeIndex, settings, tabs } = store.getState();
    close(store.getState(), previousActiveIndex);
    open(store)(store.getState());
    focusTab(store);
    if (settings.updateURL && window.history) {
        window.history.replaceState({ URL: tabs[activeIndex].getAttribute('href') }, '', tabs[activeIndex].getAttribute('href'));
    }
};

const close = ({ settings, tabs, panels }, previousActiveIndex) => {
    tabs[previousActiveIndex].classList.remove(settings.activeClass);
    tabs[previousActiveIndex].setAttribute('tabindex', '-1');
    tabs[previousActiveIndex].setAttribute('aria-selected', false);
    panels[previousActiveIndex].classList.remove(settings.activeClass);
    panels[previousActiveIndex].setAttribute('hidden', 'hidden');
    panels[previousActiveIndex].setAttribute('tabindex', '-1');
};

const activateTab = ({ settings, tabs, activeTabIndex }) => {
    tabs[activeTabIndex].classList.add(settings.activeClass);
    tabs[activeTabIndex].setAttribute('tabindex', 0);
};

const focusTab = store => {
    const { tabs, activeTabIndex } = store.getState();
    window.setTimeout(() => { tabs[activeTabIndex].focus(); }, 0);
};

export const open = store => () => {
    const { settings, tabs, panels, activeIndex, activeTabIndex, loaded } = store.getState();
    activateTab({ settings, tabs, activeTabIndex });
    if (settings.focusOnLoad && !loaded) focusTab(store);
    tabs[activeTabIndex].setAttribute('aria-selected', true);
    panels[activeIndex].classList.add(settings.activeClass);
    panels[activeIndex].removeAttribute('hidden');
    panels[activeIndex].setAttribute('tabindex', 0);

    store.update({ ...store.getState(), loaded: true }, []);
};



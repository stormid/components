import { KEYCODES, MODES } from './constants';

/*
 * DOM side effects and mutations
 */

/*
 * Returns an Object composed of two Array of HTMLElements - tabs and panels
 * 
 * @param node, HTMLElement, tab container
 * @param settings, Object, settings of the 
 * @return Object, tabs (Array of HTMLElement tab links), panels (Array of HTMLElement panel links)
 */
export const findTabsAndPanels = (node, settings) => {
    const tabs = [].slice.call(node.querySelectorAll(settings.tabSelector));
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('href').substr(1)) || console.warn(`Tab panel for ${tab}`));
    return { tabs, panels };
};
 
/*
 * Sets aria attributes and adds eventListener on each tab
 * 
 * @param Store, Object, model or state of the current instance
 */
export const initUI = Store => ({ tabs, panels }) => {
    tabs[0].parentNode.setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', false);
        panels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
        tab.setAttribute('tabindex', '-1');
        panels[i].setAttribute('role', 'tabpanel');
        panels[i].setAttribute('hidden', 'hidden');
        panels[i].setAttribute('tabindex', '-1');
        initListeners(tab, i, Store);
        if (!panels[i].firstElementChild || panels[i].firstElementChild.hasAttribute('tabindex')) return;
        panels[i].firstElementChild.setAttribute('tabindex', '-1');
    });
};

const getPreviousTabIndex = ({ activeTabIndex, tabs }) => activeTabIndex === 0 ? tabs.length - 1 : activeTabIndex - 1;

const getNextTabIndex = ({ activeTabIndex, tabs }) => activeTabIndex === tabs.length - 1 ? 0 : activeTabIndex + 1;

const initListeners = (tab, nextIndex, Store) => {
    const isManualActivation = Store.getState().settings.activation === MODES.MANUAL;
    const onDirectionChangeFunction = (isManualActivation) ? () => focusTab(Store) : changePanel;

    tab.addEventListener('keydown', e => {
        const previousIndex = Store.getState().activeIndex;
        switch (e.keyCode) {
        case KEYCODES.LEFT:
            Store.dispatch({
                activeTabIndex: getPreviousTabIndex(Store.getState()),
                activeIndex: (isManualActivation) ? Store.getState().activeIndex : getPreviousTabIndex(Store.getState())
            }, [() => onDirectionChangeFunction(Store, previousIndex)]);
            break;
        case KEYCODES.RIGHT:
            Store.dispatch({
                activeTabIndex: getNextTabIndex(Store.getState()) ,
                activeIndex: (isManualActivation) ? Store.getState().activeIndex : getNextTabIndex(Store.getState())
            }, [() => onDirectionChangeFunction(Store, previousIndex)]);
            break;
        case KEYCODES.ENTER:
            (previousIndex !== nextIndex) && Store.dispatch({ activeIndex: nextIndex, activeTabIndex: nextIndex }, [() => changePanel(Store, previousIndex)]);
            break;
        case KEYCODES.SPACE:
            e.preventDefault();
            (previousIndex !== nextIndex) && Store.dispatch({ activeIndex: nextIndex, activeTabIndex: nextIndex }, [() => changePanel(Store, previousIndex)]);
            break;
        default:
            break;
        }
    });
    
    tab.addEventListener('click', e => {
        e.preventDefault();
        const previousActiveIndex = Store.getState().activeTabIndex;
        Store.getState().activeIndex !== nextIndex && Store.dispatch({
            activeIndex: nextIndex,
            activeTabIndex: nextIndex
        }, [() => changePanel(Store, previousActiveIndex)]);
    }, false);
};

const changePanel = (Store, previousActiveIndex) => {
    const { activeIndex, updateURL, tabs } = Store.getState();
    close(Store.getState(), previousActiveIndex);
    open(Store)(Store.getState());
    focusTab(Store);
    (updateURL && window.history) && window.history.replaceState({ URL: tabs[activeIndex].getAttribute('href') }, '', tabs[activeIndex].getAttribute('href'));
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

const focusTab = Store => {
    const { tabs, activeTabIndex } = Store.getState();
    window.setTimeout(() => { tabs[activeTabIndex].focus(); }, 0);
};

export const open = Store => () => {
    const { settings, tabs, panels, activeIndex, activeTabIndex, loaded } = Store.getState();
    activateTab({ settings, tabs, activeTabIndex });
    if (settings.focusOnLoad && !loaded) focusTab(Store);
    tabs[activeTabIndex].setAttribute('aria-selected', true);
    panels[activeIndex].classList.add(settings.activeClass);
    panels[activeIndex].removeAttribute('hidden');
    panels[activeIndex].setAttribute('tabindex', 0);

    Store.dispatch({ loaded: true }, []);
};



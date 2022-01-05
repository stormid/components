import { KEYCODES } from './constants';

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
    const isManualActivation = Store.getState().settings.activation === 'manual';
    const onDirectionChangeFunction = (isManualActivation) ? changeTab : changePanel;

    tab.addEventListener('keydown', e => {
        switch (e.keyCode) {
        case KEYCODES.LEFT:
            Store.dispatch({ 
                activeTabIndex: getPreviousTabIndex(Store.getState()), 
                activeIndex: (isManualActivation) ? Store.getState().activeIndex : getPreviousTabIndex(Store.getState())
            }, [onDirectionChangeFunction(Store.getState().activeTabIndex)]);
            break;
        case KEYCODES.DOWN:
            e.preventDefault();
            e.stopPropagation();
            const previousTabIndex = Store.getState().activeTabIndex;
            Store.dispatch({activeTabIndex: Store.getState().activeIndex}, [() => {
                const state = Store.getState();
                blurTab(state, previousTabIndex);
                activateTab(state, state.activeTabIndex);
                state.panels[state.activeIndex].focus();
            }]);
            break;
        case KEYCODES.RIGHT:
            Store.dispatch({ 
                activeTabIndex: getNextTabIndex(Store.getState()) ,
                activeIndex: (isManualActivation) ? Store.getState().activeIndex : getNextTabIndex(Store.getState())
            }, [onDirectionChangeFunction(Store.getState().activeTabIndex)]);
            break;
        case KEYCODES.ENTER:
            Store.dispatch({ activeIndex: nextIndex, activeTabIndex: nextIndex }, [changePanel(Store.getState().activeIndex, Store.getState().activeTabIndex)]);
            break;
        case KEYCODES.SPACE:
            e.preventDefault();
            Store.dispatch({ activeIndex: nextIndex, activeTabIndex: nextIndex }, [changePanel(Store.getState().activeIndex, Store.getState().activeTabIndex)]);
            break;
        default:
            break;
        }
    });
    
    tab.addEventListener('click', e => {
        e.preventDefault();
        Store.getState().activeIndex !== nextIndex && Store.dispatch({ 
            activeIndex: nextIndex,
            activeTabIndex: nextIndex
        }, [changePanel(Store.getState().activeIndex)]);
    }, false);
};

const changePanel = (previousActiveIndex) => state => {
    close(state, previousActiveIndex, previousActiveIndex);
    open(state);
    (state.settings.updateURL && window.history) && window.history.replaceState({ URL: state.tabs[state.activeIndex].getAttribute('href') }, '', state.tabs[state.activeIndex].getAttribute('href'));
};

const changeTab = (previousActiveTabIndex) => state => {
    blurTab(state, previousActiveTabIndex);
    activateTab(state);
    focusTab(state);
}

const blurTab = ({ settings, tabs }, previousActiveTabIndex) => {
    tabs[previousActiveTabIndex].classList.remove(settings.activeClass);
    tabs[previousActiveTabIndex].setAttribute('tabindex', '-1');
};

const close = ({ settings, tabs, panels }, previousActiveIndex, previousActiveTabIndex) => {
    blurTab({settings, tabs}, previousActiveTabIndex);
    tabs[previousActiveTabIndex].setAttribute('aria-selected', false);
    panels[previousActiveIndex].classList.remove(settings.activeClass);
    panels[previousActiveIndex].setAttribute('hidden', 'hidden');
    panels[previousActiveIndex].setAttribute('tabindex', '-1');
};

const activateTab = ({ settings, tabs, activeTabIndex }) => {
    tabs[activeTabIndex].classList.add(settings.activeClass);
    tabs[activeTabIndex].setAttribute('tabindex', 0);
}

const focusTab = ({ tabs, activeTabIndex }) => {
    window.setTimeout(() => { tabs[activeTabIndex].focus(); }, 16);
};

export const open = ({ settings, tabs, panels, activeIndex, activeTabIndex }) => {
    activateTab({settings, tabs, activeTabIndex})
    focusTab({tabs, activeTabIndex});
    tabs[activeTabIndex].setAttribute('aria-selected', true);
    panels[activeIndex].classList.add(settings.activeClass);
    panels[activeIndex].removeAttribute('hidden');
    panels[activeIndex].setAttribute('tabindex', 0);
};



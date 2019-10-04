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
     return { tabs, panels }
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
        if(!panels[i].firstElementChild || panels[i].firstElementChild.hasAttribute('tabindex')) return;
        panels[i].firstElementChild.setAttribute('tabindex', '-1');
    });
};

const getPreviousIndex = ({ activeIndex, tabs }) => activeIndex === 0 ? tabs.length - 1 : activeIndex - 1;

const getNextIndex = ({ activeIndex, tabs }) => activeIndex === tabs.length - 1 ? 0 : activeIndex + 1;

const initListeners = (tab, nextIndex, Store) => {
    tab.addEventListener('keydown', e => {
        switch (e.keyCode) {
            case KEYCODES.LEFT:
                Store.dispatch({ activeIndex: getPreviousIndex(Store.getState()) }, [change(Store.getState().activeIndex)]);
                break;
            case KEYCODES.DOWN:
                e.preventDefault();
                e.stopPropagation();
                Store.getState().panels[Store.getState().activeIndex].focus();
                break;
            case KEYCODES.RIGHT:
                Store.dispatch({ activeIndex: getNextIndex(Store.getState()) }, [change(Store.getState().activeIndex)]);
                break;
            case KEYCODES.ENTER:
                Store.getState().activeIndex !== nextIndex && Store.dispatch({ activeIndex: nextIndex }, [change(Store.getState().activeIndex)]);
                break;
            case KEYCODES.SPACE:
                e.preventDefault();
                Store.getState().activeIndex !== nextIndex && Store.dispatch({ activeIndex: nextIndex }, [change(Store.getState().activeIndex)]);
                break;
            default:
                break;
        }
    });
    tab.addEventListener('click', e => {
        e.preventDefault();
        Store.getState().activeIndex !== nextIndex && Store.dispatch({ activeIndex: nextIndex }, [change(Store.getState().activeIndex)]);
    }, false);
};

const change = previousActiveIndex => state => {    
    close(state, previousActiveIndex);
    open(state);
    window.setTimeout(() => { state.tabs[state.activeIndex].focus(); }, 16);
    (state.settings.updateURL && window.history) && window.history.replaceState({ URL: state.tabs[state.activeIndex].getAttribute('href') }, '', state.tabs[state.activeIndex].getAttribute('href'));
};

const close = ({ settings, tabs, panels }, previousActiveIndex) => {
    tabs[previousActiveIndex].classList.remove(settings.activeClass);
    panels[previousActiveIndex].classList.remove(settings.activeClass);
    panels[previousActiveIndex].setAttribute('hidden', 'hidden');
    tabs[previousActiveIndex].setAttribute('aria-selected', false);
    tabs[previousActiveIndex].setAttribute('tabindex', '-1');
    panels[previousActiveIndex].setAttribute('tabindex', '-1');
};

export const open = ({ settings, tabs, panels, activeIndex }) => {
    tabs[activeIndex].classList.add(settings.activeClass);
    panels[activeIndex].classList.add(settings.activeClass);
    panels[activeIndex].removeAttribute('hidden');
    tabs[activeIndex].setAttribute('aria-selected', true);
    tabs[activeIndex].setAttribute('tabindex', 0);
    panels[activeIndex].setAttribute('tabindex', 0);
};
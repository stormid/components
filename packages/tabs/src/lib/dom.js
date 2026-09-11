import { KEYS, MODES, FOCUSABLE_ELEMENTS } from './constants.js';
import { uid } from './utils.js';

/*
 * Resolves the id of the panel a tab controls.
 * Prefers aria-controls (works for <button> and <a>), falling back to the
 * fragment of an href (supporting both '#id' and '/path#id').
 *
 * @param tab, HTMLElement, a tab trigger
 * @return String|null, the panel id or null if none can be resolved
 */
const getPanelId = tab => {
    const controls = tab.getAttribute('aria-controls');
    if (controls) return controls;
    const href = tab.getAttribute('href');
    return href && href.includes('#') ? href.slice(href.indexOf('#') + 1) : null;
};

/*
 * Returns an Object composed of two Array of HTMLElements - tabs and panels
 *
 * @param node, HTMLElement, tab container
 * @param settings, Object, settings of the instance
 * @return Object, tabs (Array of HTMLElement tab triggers), panels (Array of HTMLElement panels)
 */
export const findTabsAndPanels = (node, settings) => {
    const tabs = Array.from(node.querySelectorAll(settings.tabSelector));
    const panels = tabs.map(tab => {
        const id = getPanelId(tab);
        return (id && document.getElementById(id)) || console.warn(`Tab panel not found for ${tab}`);
    });
    return { tabs, panels };
};

/*
 * Sets aria attributes and adds eventListeners on each tab
 *
 * @param store, Object, model or state of the current instance
 */
export const initUI = store => ({ tabs, panels }) => {
    const { controller } = store.getState();
    tabs[0].parentNode.setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
        //a tab needs an id for its panel to reference via aria-labelledby; mint one when it has
        //none rather than writing aria-labelledby="null" (panels are located by id, so they always have one)
        if (!tab.getAttribute('id')) tab.setAttribute('id', uid('tab'));
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('aria-controls', panels[i].getAttribute('id'));
        tab.setAttribute('tabindex', '-1');
        panels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
        panels[i].setAttribute('role', 'tabpanel');
        panels[i].setAttribute('hidden', 'hidden');
        panels[i].setAttribute('tabindex', '-1');
        initListeners(tab, i, store, controller.signal);
    });
};

const getPreviousTabIndex = ({ activeTabIndex, tabs }) => activeTabIndex === 0 ? tabs.length - 1 : activeTabIndex - 1;

const getNextTabIndex = ({ activeTabIndex, tabs }) => activeTabIndex === tabs.length - 1 ? 0 : activeTabIndex + 1;

const getNavTargetIndex = (key, state) => {
    switch (key) {
    case KEYS.LEFT: return getPreviousTabIndex(state);
    case KEYS.RIGHT: return getNextTabIndex(state);
    case KEYS.HOME: return 0;
    case KEYS.END: return state.tabs.length - 1;
    default: return state.activeTabIndex;
    }
};

const initListeners = (tab, nextIndex, store, signal) => {
    tab.addEventListener('keydown', e => {
        const state = store.getState();
        const previousIndex = state.activeIndex;
        const isManualActivation = state.settings.activation === MODES.MANUAL;

        switch (e.key) {
        case KEYS.LEFT:
        case KEYS.RIGHT:
        case KEYS.HOME:
        case KEYS.END: {
            e.preventDefault();
            const targetIndex = getNavTargetIndex(e.key, state);
            //Home/End (and the ends when arrows don't wrap) can resolve to where we already are;
            //re-running the effect would rove focus needlessly or, in auto mode, re-fire onChange
            //and rewrite the URL for a tab that is already active, so bail when nothing moves.
            if (isManualActivation) {
                if (targetIndex !== state.activeTabIndex) store.update({ ...state, activeTabIndex: targetIndex }, [() => roveFocus(store)]);
            } else if (targetIndex !== previousIndex) store.update({ ...state, activeTabIndex: targetIndex, activeIndex: targetIndex }, [() => changePanel(store, previousIndex)]);
            break;
        }
        case KEYS.ENTER:
        case KEYS.SPACE:
        case KEYS.SPACE_LEGACY:
            e.preventDefault();
            (previousIndex !== nextIndex) && store.update({ ...state, activeIndex: nextIndex, activeTabIndex: nextIndex }, [() => changePanel(store, previousIndex)]);
            break;
        default:
            break;
        }
    }, { signal });

    tab.addEventListener('click', e => {
        e.preventDefault();
        const state = store.getState();
        const previousActiveIndex = state.activeIndex;
        state.activeIndex !== nextIndex && store.update({
            ...state,
            activeIndex: nextIndex,
            activeTabIndex: nextIndex
        }, [() => changePanel(store, previousActiveIndex)]);
    }, { signal });
};

const changePanel = (store, previousActiveIndex, focus = true) => {
    const { activeIndex, settings, tabs, panels } = store.getState();
    close(store.getState(), previousActiveIndex);
    open(store)(store.getState());
    //keyboard and click activation move focus onto the new tab; programmatic goTo can opt out
    //so calling it from an unrelated control doesn't yank focus across the page
    if (focus) focusTab(store);
    if (settings.updateUrl && window.history) {
        const hash = `#${panels[activeIndex].getAttribute('id')}`;
        window.history.replaceState({ URL: hash }, '', hash);
    }
    if (typeof settings.onChange === 'function') settings.onChange({ activeIndex, tab: tabs[activeIndex], panel: panels[activeIndex] });
};

const close = ({ settings, tabs, panels }, previousActiveIndex) => {
    tabs[previousActiveIndex].classList.remove(settings.activeClass);
    tabs[previousActiveIndex].setAttribute('tabindex', '-1');
    tabs[previousActiveIndex].setAttribute('aria-selected', 'false');
    panels[previousActiveIndex].classList.remove(settings.activeClass);
    panels[previousActiveIndex].setAttribute('hidden', 'hidden');
    panels[previousActiveIndex].setAttribute('tabindex', '-1');
};

const activateTab = ({ settings, tabs, activeTabIndex }) => {
    //Reset the roving tabindex across every tab, not just the previously-selected one: manual
    //arrow navigation can have parked tabindex="0" on a third, unselected tab, and leaving it
    //would give the tablist two tab stops. Exactly one tab (the active one) stays reachable.
    tabs.forEach((tab, i) => tab.setAttribute('tabindex', i === activeTabIndex ? '0' : '-1'));
    tabs[activeTabIndex].classList.add(settings.activeClass);
};

const focusTab = store => {
    const { tabs, activeTabIndex } = store.getState();
    tabs[activeTabIndex].focus();
};

/*
 * Moves the roving tabindex to the currently focused tab without activating it,
 * then focuses it. Used for manual-activation arrow/Home/End navigation.
 */
const roveFocus = store => {
    const { tabs, activeTabIndex } = store.getState();
    tabs.forEach((tab, i) => tab.setAttribute('tabindex', i === activeTabIndex ? '0' : '-1'));
    focusTab(store);
};

/*
 * A panel only needs to be in the tab order (tabindex="0") when it has no
 * focusable content of its own, as per the WAI-ARIA tabs pattern.
 */
const setPanelTabindex = panel => {
    if (panel.querySelector(FOCUSABLE_ELEMENTS.join(','))) panel.removeAttribute('tabindex');
    else panel.setAttribute('tabindex', '0');
};

export const open = store => () => {
    const { settings, tabs, panels, activeIndex, activeTabIndex, loaded } = store.getState();
    activateTab({ settings, tabs, activeTabIndex });
    if (settings.focusOnLoad && !loaded) focusTab(store);
    tabs[activeTabIndex].setAttribute('aria-selected', 'true');
    panels[activeIndex].classList.add(settings.activeClass);
    panels[activeIndex].removeAttribute('hidden');
    setPanelTabindex(panels[activeIndex]);

    store.update({ ...store.getState(), loaded: true }, []);
};

export { changePanel };

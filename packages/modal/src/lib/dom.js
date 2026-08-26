import { FOCUSABLE_ELEMENTS, ACCEPTED_TRIGGERS, EVENTS } from './constants.js';
import { broadcast } from './utils.js';

/*
 * Tests whether an IDREF(S) attribute value points to at least one existing element.
 * Uses getElementById (per space-separated id) rather than querySelector so ids that need
 * CSS escaping, or lists of multiple ids, are handled correctly.
 *
 * @param ids, String|null, the value of an aria-labelledby/aria-describedby attribute
 * @return Boolean
 */
const referencesElement = ids => !!ids && ids.split(/\s+/).some(id => id && document.getElementById(id));

/*
 * @param node, HTMLElement
 * @return child HTMLElement with dialog/alertdialog role
 */
export const findDialog = node => (node.querySelector('[role=dialog]') || node.querySelector('[role=alertdialog]')) || console.warn(`No dialog or alertdialog found in modal node`);

/*
 * @param node, HTMLElement, modal node
 * @param settings, Object, instance configuration
 * @return Array of HTMLElements that open/close the modal node
 */
export const findToggles = (node, settings) => {
    const toggleSelector = node.getAttribute(settings.toggleSelectorAttribute);
    const composeSelector = classSelector => ACCEPTED_TRIGGERS.map(sel => `${sel}.${classSelector}`).join(', ');

    const toggles = toggleSelector && [].slice.call(document.querySelectorAll(composeSelector(toggleSelector)));
    if (!toggles) return void console.warn(`Modal cannot be initialised, no modal toggle elements found. Does the modal have a ${settings.toggleSelectorAttribute} attribute that identifies toggle buttons or links?`);
    return toggles;
};

/* 
  * @param node, HTMLElement
  * @return Array of focusable child HTMLElements
 */
export const getFocusableChildren = node => [].slice.call(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));

/* 
 * Partially applied function that returns function
 *
 * @param store, Object, store of the current instance state
 * @returns Function, handler for keyDown
 *
 * @param event, Event
 */
export const keyListener = store => event => {
    const state = store.getState();
    if (!state.isOpen) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        lifecycle(store); // route through lifecycle rather than duplicating the state transition
    } else if (event.key === 'Tab') trapTab(state)(event);
};

/* 
 * Partially applied function that returns a function
 *
 * @param state, Object, current instance state
 * @returns Function
 *
 * @param event, Event
 */
const trapTab = state => event => {
    const focusable = state.focusableChildren;
    // nothing focusable inside the modal — keep focus on the dialog itself
    if (focusable.length === 0) {
        event.preventDefault();
        state.dialog.focus();
        return;
    }
    const focusedIndex = focusable.indexOf(document.activeElement);
    // focus has escaped the modal (e.g. onto the body) — pull it back to the first focusable
    if (focusedIndex === -1) {
        event.preventDefault();
        focusable[0].focus();
    } else if (event.shiftKey && focusedIndex === 0) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
    } else if (!event.shiftKey && focusedIndex === focusable.length - 1) {
        event.preventDefault();
        focusable[0].focus();
    }
};

/*
 * Reflects the open/closed state onto the modal node and document element.
 * Uses explicit add/remove keyed on isOpen (rather than toggle) so state can't drift out of sync.
 *
 * @param state, Object, the current instance state
 */
const setVisibility = state => {
    const method = state.isOpen ? 'add' : 'remove';
    state.node[state.isOpen ? 'removeAttribute' : 'setAttribute']('hidden', 'hidden');
    state.node.classList[method](state.settings.onClassName);
    document.documentElement.classList[method]('is--modal');
};

/*
 * Makes every body-level sibling of the modal node inert (removing it from focus, pointer and the
 * accessibility tree in supporting browsers). Only siblings not already inert are touched, and the
 * set is recorded on state so removeInert restores exactly what this instance changed.
 *
 * @param store, Object, store of the current instance state
 */
const setInert = store => () => {
    const state = store.getState();
    const inerted = [].slice.call(document.querySelectorAll('body > *'))
        .filter(child => child !== state.node && !child.hasAttribute('inert'));
    inerted.forEach(child => child.setAttribute('inert', ''));
    store.update({ ...state, inerted });
};

/*
 * Removes inert from the siblings this instance made inert, then clears the record.
 *
 * @param store, Object, store of the current instance state
 */
const removeInert = store => () => {
    const state = store.getState();
    (state.inerted || []).forEach(child => child.removeAttribute('inert'));
    store.update({ ...store.getState(), inerted: [] });
};

/*
 * @param store, Object, store of the current instance state
 */
const open = store => () => {
    const state = store.getState();
    if (state.dialog.hasAttribute('aria-hidden')) state.dialog.removeAttribute('aria-hidden'); // past implementations encouraged having aria-hidden on dialog when closed
    const ref = document.body.firstElementChild || null;
    const moved = ref !== state.node;
    // recompute focusable children in case the modal's contents changed since init;
    // capture the node's current position (before moving it) so close can restore it
    store.update({
        ...state,
        focusableChildren: getFocusableChildren(state.node),
        ...(moved ? { originalParent: state.node.parentNode, originalNextSibling: state.node.nextSibling } : {})
    });
    if (moved) document.body.insertBefore(state.node, ref);
    document.addEventListener('keydown', state.keyListener);
    setVisibility(store.getState());
    setInert(store)();
    const current = store.getState();
    const focusFn = () => (current.focusableChildren.length > 0 ? current.focusableChildren[0] : current.dialog).focus();
    if (current.settings.delay) window.setTimeout(focusFn, current.settings.delay);
    else focusFn();
    broadcast(EVENTS.OPEN, store)();
};

/*
 * @param store, Object, store of the current instance state
 */
const close = store => () => {
    const state = store.getState();
    document.removeEventListener('keydown', state.keyListener);
    setVisibility(state);
    removeInert(store)();
    // restore the node to the position it was moved from on open
    if (state.originalParent) {
        if (state.originalNextSibling && state.originalNextSibling.parentNode === state.originalParent) state.originalParent.insertBefore(state.node, state.originalNextSibling);
        else state.originalParent.appendChild(state.node);
    }
    // return focus to whatever opened the modal; fall back to a toggle when there was no trigger (e.g. startOpen)
    const returnTarget = state.lastFocused && state.lastFocused !== document.body ? state.lastFocused : (state.toggles && state.toggles[0]);
    if (returnTarget && typeof returnTarget.focus === 'function') returnTarget.focus();
    broadcast(EVENTS.CLOSE, store)();
};


/* 
 * Partially applied function that returns a function
 *
 * @param store, Object, store of the current instance state
 * @returns Function
 *
 */
export const change = store => state => {
    if (state.isOpen) open(store)();
    else close(store)();
    typeof state.settings.callback === 'function' && state.settings.callback.call(state);
};

/*
 * Partially applied function that returns a function
 * Sets aria attributes and adds eventListener on each modal toggle
 *
 * @param store, Object, store of the current instance state
 * @returns Function
 * 
 * @param node, HTMLElement, modal node
 * @param dialog, HTMLElement, dialog/alertdialog node
 * @param toggles, Array of HTMLElements, trigger elements
 * 
 */
export const initUI = store => ({ node, dialog, toggles }) => {
    if (!dialog || !toggles) return;
    node.setAttribute('hidden', 'hidden');
    dialog.setAttribute('aria-modal', 'true'); // mark the dialog as modal for assistive technology
    if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1'); // allow focus to land on the dialog when it has no focusable children
    if (!dialog.getAttribute('aria-label') && !referencesElement(dialog.getAttribute('aria-labelledby'))) console.warn(`The modal dialog should have an aria-labelledby attribute that matches the id of an element that contains text, or an aria-label attribute.`);
    if (dialog.getAttribute('role') === 'alertdialog' && !referencesElement(dialog.getAttribute('aria-describedby'))) console.warn(`The alertdialog should have an aria-describedby attribute that matches the id of an element that contains text`);

    toggles.forEach(tgl => tgl.addEventListener('click', store.getState().toggleHandler));
};

/*
 * @param store, Object, store of the current instance state
*/
export const lifecycle = store => store.update({
    ...store.getState(),
    isOpen: !store.getState().isOpen,
    lastFocused: store.getState().isOpen ? store.getState().lastFocused : document.activeElement
}, [ change(store) ]);
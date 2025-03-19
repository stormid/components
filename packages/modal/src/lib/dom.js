import { FOCUSABLE_ELEMENTS, ACCEPTED_TRIGGERS, EVENTS } from './constants';
import { broadcast } from './utils';

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
    const { isOpen } = state;
    if (isOpen && event.keyCode === 27) {
        event.preventDefault();
        store.update({
            ...store.getState(),
            isOpen: !isOpen
        }, [ change(store) ]);
    }
    if (isOpen && event.keyCode === 9) trapTab(state)(event);
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
    const focusedIndex = state.focusableChildren.indexOf(document.activeElement);
    if (event.shiftKey && focusedIndex === 0) {
        event.preventDefault();
        state.focusableChildren[state.focusableChildren.length - 1].focus();
    } else if (!event.shiftKey && focusedIndex === state.focusableChildren.length - 1) {
        event.preventDefault();
        state.focusableChildren[0].focus();
    }
};

/* 
 * @param state, Object, the current instance state
 */
const toggle = state => {
    state.node[state.isOpen ? 'removeAttribute' : 'setAttribute']('hidden', 'hidden');
    const children = [].slice.call(document.querySelectorAll('body > *'));
    children.forEach(child => child !== state.node && child[state.isOpen ? 'setAttribute' : 'removeAttribute']('aria-hidden', 'true'));
    state.node.classList.toggle(state.settings.onClassName);
    document.documentElement.classList.toggle('is--modal');
};

/* 
 * @param store, Object, store of the current instance state
 */
const open = store => () => {
    const state = store.getState();
    if (state.dialog.hasAttribute('aria-hidden')) state.dialog.removeAttribute('aria-hidden'); // past implementations encouraged having aria-hidden on dialog when closed
    const ref = document.body.firstElementChild || null;
    if (ref !== state.node) document.body.insertBefore(state.node, ref);
    document.addEventListener('keydown', state.keyListener);
    toggle(state);
    const focusFn = () => state.focusableChildren.length > 0 && state.focusableChildren[0].focus();
    if (state.settings.delay) window.setTimeout(focusFn, state.settings.delay);
    else focusFn();
    broadcast(EVENTS.OPEN, store)();
};

/* 
 * @param store, Object, store of the current instance state
 */
const close = store => () => {
    const state = store.getState();
    document.removeEventListener('keydown', state.keyListener);
    toggle(state);
    state.lastFocused.focus();
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
    else close(store)(state);
    typeof state.settings.callback === 'function' &&  state.settings.callback.call(state);
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
    if (
        !dialog.getAttribute('aria-label') &&
        (!dialog.getAttribute('aria-labelledby') || !document.querySelector(`#${dialog.getAttribute('aria-labelledby')}`))
    ) console.warn(`The modal dialog should have an aria-labelledby attribute that matches the id of an element that contains text, or an aria-label attribute.`);
    if (dialog.getAttribute('role') === 'alertdialog' && (!dialog.getAttribute('aria-describedby') || !document.querySelector(`#${dialog.getAttribute('aria-describedby')}`))) console.warn(`The alertdialog should have an aria-describedby attribute that matches the id of an element that contains text`);
    
    toggles.forEach(tgl => {
        tgl.addEventListener('click', e => {
            e.preventDefault();
            lifecycle(store);
        });
    });
};

/*
 * @param store, Object, store of the current instance state
*/
export const lifecycle = store => store.update({
    ...store.getState(),
    isOpen: !store.getState().isOpen,
    lastFocused: store.getState().isOpen ? store.getState().lastFocused : document.activeElement
}, [ change(store) ]);
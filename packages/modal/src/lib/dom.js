import { FOCUSABLE_ELEMENTS, ACCEPTED_TRIGGERS } from './constants';

/*
 * Returns an HTMLElement child of the supplied node with a role of dialog
 *
 * @param node, HTMLElement, tab container
 * @param settings, Object, settings of the 
 * @return HTMLElement
 */
export const findDialog = node => (node.querySelector('[role=dialog]') || node.querySelector('[role=alertdialog]')) || console.warn(`No dialog or alertdialog found in modal node`);

/*
 * Returns an Array of HTMLElements selected based on data-toggle attribute of a given node
 *
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements
 */
export const findToggles = (node, settings) => {

    const toggleSelector = node.getAttribute(settings.toggleSelectorAttribute);
    const composeSelector = classSelector => ACCEPTED_TRIGGERS.map(sel => `${sel}.${classSelector}`).join(', ');

    const toggles = toggleSelector && [].slice.call(document.querySelectorAll(composeSelector(toggleSelector)));
    if (!toggles) console.warn(`Modal cannot be initialised, no modal toggle elements found. Does the modal have a ${settings.toggleSelectorAttribute} attribute that identifies toggle buttons or anchors?`);
    return toggles;
};

/* 
  * Returns an Array of HTMLElements selected from parentNode based on whitelist FOCUSABLE_ELEMENTS constant
  *
  * @param node, HTMLElement, node to be toggled
  * @return Array of HTMLElements
 */
export const getFocusableChildren = node => [].slice.call(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));

/* 
 * Partially applied function that returns a function
 *
 * @param Store, Object, model or store of the current instance
 * @returns Function, handler for keyDown
 *
 * @param event, Event
 */
export const keyListener = Store => event => {
    if (Store.getState().isOpen && event.keyCode === 27) {
        event.preventDefault();
        Store.dispatch({
            isOpen: !Store.getState().isOpen
        }, [ change(Store) ]);
    }
    if (Store.getState().isOpen && event.keyCode === 9) trapTab(Store.getState())(event);
};

/* 
 * Partially applied function that returns a function
 *
 * @param Store, Object, model or store of the current instance
 * @returns Function:
 *
 * @param state, Object, the current state or model of the instance
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
 * @param state, Object, the current state or model of the instance
 */
const toggle = state => {
    state.node[state.isOpen ? 'removeAttribute' : 'setAttribute']('hidden', 'hidden');
    const children = [].slice.call(document.querySelectorAll('body > *'));
    children.forEach(child => child !== state.node && child[state.isOpen ? 'setAttribute' : 'removeAttribute']('aria-hidden', 'true'));
    state.node.classList.toggle(state.settings.onClassName);
    document.documentElement.classList.toggle('is--modal');
};

/* 
 * @param Store, Object, model or store of the current instance
 */
const open = Store => () => {
    const state = Store.getState();
    if (state.dialog.hasAttribute('aria-hidden')) state.dialog.removeAttribute('aria-hidden'); // past implementations encouraged having aria-hidden on dialog when closed
    const ref = document.body.firstElementChild || null;
    if (ref !== state.node) document.body.insertBefore(state.node, ref);
    document.addEventListener('keydown', state.keyListener);
    toggle(state);
    const focusFn = () => state.focusableChildren.length > 0 && state.focusableChildren[0].focus();
    if (state.settings.delay) window.setTimeout(focusFn, state.settings.delay);
    else focusFn();
};

/* 
 * @param Store, Object, model or store of the current instance
 */
const close = Store => () => {
    const state = Store.getState();
    document.removeEventListener('keydown', state.keyListener);
    toggle(state);
    state.lastFocused.focus();
};


/* 
 * Partially applied function that returns a function
 *
 * @param Store, Object, model or store of the current instance
 * @returns Function
 *
 */
export const change = Store => state => {
    if (state.isOpen) open(Store)();
    else close(Store)(state);
    typeof state.settings.callback === 'function' &&  state.settings.callback.call(state);
};

/*
 * Sets aria attributes and adds eventListener on each tab
 *
 * @param Store, Object, model or state of the current instance
 */
export const initUI = Store => ({ node, dialog, toggles }) => {
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
            lifecycle(Store);
        });
    });
};

export const lifecycle = Store => Store.dispatch({
    isOpen: !Store.getState().isOpen,
    lastFocused: Store.getState().isOpen ? Store.getState().lastFocused : document.activeElement
}, [ change(Store) ]);
import { FOCUSABLE_ELEMENTS, TRIGGER_EVENTS, KEYCODES } from './constants';

/*
 * Returns an HTMLElement child of the supplied node with a role of dialog
 * 
 * @param node, HTMLElement, tab container
 * @param settings, Object, settings of the 
 * @return HTMLElement
 */
export const findDialog = node => node.querySelector('[role=dialog]') || console.error(`No dialog found in modal node`);

/*
 * Returns an Array of HTMLElements selected based on data-toggle attribute of a given node
 * 
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements
 */
export const findToggles = (node, settings) => {
    const toggles = node.getAttribute(settings.toggleSelectorAttribute) && Array.from(document.querySelectorAll('.' + node.getAttribute(settings.toggleSelectorAttribute)));
    if(!toggles.length) console.error(`Modal cannot be initialised, no modal toggle elements found. Does the modal have a ${settings.toggleSelectorAttribute} attribute that identifies toggle buttons?`);
    return toggles;
}

 /* 
  * Returns an Array of HTMLElements selected from parentNode based on whitelist FOCUSABLE_ELEMENTS constant
  * 
  * @param node, HTMLElement, node to be toggled
  * @return Array of HTMLElements
 */
export const getFocusableChildren = node => Array.from(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));

/* 
 * Partially applied function that returns a function
 * 
 * @param Store, Object, model or store of the current instance
 * @returns Function, handler for keyDown
 *
 * @param e, Event
 */
export const keyListener = Store => e => {
    if (Store.getState().isOpen && e.keyCode === 27) {
        e.preventDefault();
        toggle(Store)();
    }
    if (Store.getState().isOpen && e.keyCode === 9) trapTab(Store.getState())(e);
};

/* 
 * Partially applied function that returns a function
 * 
 * @param Store, Object, model or store of the current instance
 * @returns Function:
 *
 * @param state, Object, the current state or model of the instance
 */
const trapTab = state => e =>{
    const focusedIndex = state.focusableChildren.indexOf(document.activeElement);
    if(e.shiftKey && focusedIndex === 0) {
        e.preventDefault();
        state.focusableChildren[state.focusableChildren.length - 1].focus();
    } else {
        if(!e.shiftKey && focusedIndex === state.focusableChildren.length - 1) {
            e.preventDefault();
            state.focusableChildren[0].focus();
        }
    }
};

/* 
 * @param state, Object, the current state or model of the instance
 */
const toggle = state => {
    state.dialog.setAttribute('aria-hidden', !state.isOpen);
    state.node.classList.toggle(state.settings.onClassName);
    // document.querySelector(this.settings.mainSelector) && document.querySelector(this.settings.mainSelector).setAttribute('aria-hidden', this.isOpen);
};

/* 
 * @param state, Object, the current state or model of the instance
 */
const open = state => {
    document.addEventListener('keydown', state.keyListener);
    toggle(state);
    const focusFn = () => state.focusableChildren.length > 0 && state.focusableChildren[0].focus();
    if(state.settings.delay) window.setTimeout(focusFn, state.settings.delay);
    else focusFn();
};

/* 
 * @param state, Object, the current state or model of the instance
 */
const close = state => {
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
    if(state.isOpen) open(state);
    else close(state);
	typeof state.settings.callback === 'function' &&  state.settings.callback.call(state);
};

/*
 * Sets aria attributes and adds eventListener on each tab
 * 
 * @param Store, Object, model or state of the current instance
 */
export const initUI = Store => ({ node, dialog, toggles }) => { 
   dialog.setAttribute('aria-hidden', true);
   if(!dialog.getAttribute('aria-modal')) console.warn(`The modal dialog should have an aria-modal attribute of 'true'.`);
   if(
       !dialog.getAttribute('aria-label') &&
       (!dialog.getAttribute('aria-labelledby') || !document.querySelector(`#${dialog.getAttribute('aria-labelledby')}`))
    ) console.warn(`The modal dialog should have an aria-labelledby attribute that matches the id of an element that contains text, or an aria-label attribute.`);
   //check aria-labelledby= an id in the dialog
   toggles.forEach(tgl => {
        TRIGGER_EVENTS.forEach(ev => {
            tgl.addEventListener(ev, e => {
                if(!!e.keyCode && !~KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3)) return;
                e.preventDefault();
                Store.dispatch({ 
                    isOpen: !Store.getState().isOpen,
                    lastFocused: Store.getState().isOpen ? Store.getState().lastFocused : document.activeElement
                }, [ change(Store) ]);
            });
        });
    })
};
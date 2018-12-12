import { FOCUSABLE_ELEMENTS } from './constants';

/*
 * DOM side effecta and mutations
 */

/*
 * Returns an Array of HTMLElements selected based on data-toggle attribute of a given node
 * 
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements
 */
export const findToggles = node => {
    const toggles = node.getAttribute('data-toggle') && Array.from(document.querySelectorAll('.' + node.getAttribute('data-toggle')));
    if(!toggles) throw console.warn(`Toggle cannot be initialised, no buttons found for ${node}. Does it have a data-toggle attribute that identifies toggle buttons?`);
    return toggles;
};

/*
 * Returns an Array of HTMLElements selected from parentNode based on whitelist FOCUSABLE_ELEMENTS constant
 * 
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements
 */
export const getFocusableChildren = node => Array.from(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));

/*
 * Change toggle button attributes and node target classNames
 * 
 * @param props, Object, composed of properties of current state required to accessibly change node toggles attributes
 */
export const toggleAttributes = ({ toggles, isOpen, classTarget, animatingClass, statusClass }) => {
    toggles.forEach(toggle => toggle.setAttribute('aria-expanded', isOpen));
    classTarget.classList.remove(animatingClass);
    classTarget.classList.toggle(statusClass);
};

/*
 * Partially applied function that returns a handler function for keydown events when toggle is open
 * Only added as an eventListener when trapTab option is set
 * 
 * @param Store, Object, model or store of the current instance
 * @returns Function, keyboard event handler
 * 
 * @param Event, document keydown event dispatched from document
 */
export const keyListener = Store => e => {
    switch(e.keyCode){
        case 27:
            e.preventDefault();
            startToggleCycle(Store);
        break;
        case 9:
            trapTab(Store, e);
        break;
    }
};

/*
 * Checks activeElement and compares with array of focusable elements in target node
 * If shift is held focus set on the last focusable element
 * If last element, focus is set on the first element
 * 
 * @param Store, Object, model or store of the current instance
 * @param e, Event, document keydown event passed down from keyListener
 */
const trapTab = (Store, e) => {
    const focusableChildren = Store.getState().focusableChildren;
    const focusedIndex = focusableChildren.indexOf(document.activeElement);
    if(e.shiftKey && focusedIndex === 0) {
        e.preventDefault();
        focusableChildren[this.focusableChildren.length - 1].focus();
    } else {
        if(!e.shiftKey && focusedIndex === focusableChildren.length - 1) {
            e.preventDefault();
            focusableChildren[0].focus();
        }
    }
};

/*
 * Partially applied function that returns handler for focusin events when toggle is open
 * Only added as an eventListener when closeOnBlur option is set
 * 
 * @param Store, Object, model or store of the current instance
 * @returns Function, focusin event handler
 * 
 * @param Event, focusin event dispatched from document
 */
export const focusInListener = Store => e => {
    const { node, toggles } = Store.getState();
    if(!node.contains(e.target) && !toggles.reduce((acc, toggle) => {
            if(toggle === e.target) acc = true;
            return acc;
        }, false)
    ) toggle();
};

/*
 * Partially applied function that returns a function that adds and removes the document focusInListener
 * Only added as an eventListener when closeOnBlur option is set
 * 
 * @param Store, Object, model or state of the current instance
 */
export const closeOnBlur = Store => () => {
    const { settings, isOpen, focusInListener } = Store.getState();
    if(!settings.closeOnBlur) return;
    document[`${isOpen ? 'add' : 'remove'}EventListener`]('focusin', focusInListener);
};

/*
 * Partially applied function that returns a function that sets up and pulls down focus event handlers based on toggle status and focus management options 
 * 
 * @param Store, Object, model or state of the current instance
 */
export const manageFocus = Store => () => {
    const { isOpen, focusableChildren, settings, lastFocused, keyListener } = Store.getState();

    if(!settings.focus || focusableChildren.length === 0) return;
    if(!isOpen){
        Store.dispatch({ lastFocused: document.activeElement });
        const focusFn = () => focusableChildren[0].focus();
        if(settings.delay) window.setTimeout(focusFn, settings.delay);
        else focusFn();
        if(!settings.trapTab) return;
        document.addEventListener('keydown', keyListener);
    }
    else {
        settings.trapTab && document.removeEventListener('keydown', keyListener);
        const reFocusFn = () => {
            lastFocused && lastFocused.focus();
            Store.dispatch({ lastFocused: false });
        };
        if(settings.delay) window.setTimeout(reFocusFn, settings.delay);
        else reFocusFn();
    }
};
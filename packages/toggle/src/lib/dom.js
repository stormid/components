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
 * Partially applied function that returns handler for keyboard events when toggle is open
 * 
 * @param Store, Object, model or store of the current instance
 * @returns Function, keyboard event handler
 * @param Event
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

export const focusInListener = Store => e => {
    const { node, toggles } = Store.getState();
    if(!node.contains(e.target) && !toggles.reduce((acc, toggle) => {
            if(toggle === e.target) acc = true;
            return acc;
        }, false)
    ) toggle();
};

export const closeOnBlur = Store => () => {
    const { settings, isOpen, focusInListener } = Store.getState();
    if(!settings.closeOnBlur) return;
    document[`${isOpen ? 'add' : 'remove'}EventListener`]('focusin', focusInListener);
};

export const manageFocus = Store => () => {
    const { isOpen, focusableChildren, settings, lastFocused, keyListener } = Store.getState();
    console.log(lastFocused);

    if(!settings.focus || focusableChildren.length === 0) return;
    if(!isOpen){
        Store.dispatch({ lastFocused: document.activeElement });
        window.setTimeout(() => focusableChildren[0].focus(), settings.delay);
        if(!settings.trapTab) return;
        document.addEventListener('keydown', keyListener);
    }
    else {
        settings.trapTab && document.removeEventListener('keydown', keyListener);
        focusableChildren.length > 0 && window.setTimeout(() => {
            lastFocused && lastFocused.focus();
            Store.dispatch({ lastFocused: false });
        }, settings.delay);
    }
};
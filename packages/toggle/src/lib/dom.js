import { FOCUSABLE_ELEMENTS, ACCEPTED_TRIGGERS, EVENTS } from './constants';

/*
 * Sets aria attributes and adds eventListener on each toggle button
 * 
 * @param Store, Object, model or state of the current instance
 */
export const initUI = Store => () => {
    const { toggles, node, settings } = Store.getState();
    if(settings.useHidden) node.hidden = true;
    toggles.forEach(toggle => {
        const id = node.getAttribute('id');
        if (toggle.tagName !== 'BUTTON') toggle.setAttribute('role', 'button');
        if (!id) throw console.warn(`The toggle target should have an id.`);
        toggle.setAttribute('aria-controls', id);
        toggle.setAttribute('aria-expanded', 'false');

        toggle.addEventListener('click', e => {
            e.preventDefault();
            startToggleLifecycle(Store)();
        });
    });
};

/*
 * Dispatches a toggle action to the Store
 * 
 * @param Store, Object, model or state of the current instance
 */
export const toggle = Store => () => {
    Store.dispatch({
        isOpen: !Store.getState().isOpen
    },
    [toggleAttributes, manageFocus(Store), closeProxy(Store), broadcast(Store)]
    );
};

/*
 * Partially applied function that returns a function that begins the toggle lifecycle (prehook > toggle > callback)
 * 
 * @param Store, Object, model or state of the current instance
 * @returns Function
 */
export const startToggleLifecycle = Store => () => {
    const { node, toggles, settings, isOpen, classTarget, animatingClass } = Store.getState();
    (settings.prehook && typeof settings.prehook === 'function') && settings.prehook({ node, toggles, isOpen });
    classTarget.classList.add(animatingClass);
    const fn = () => {
        toggle(Store)();
        (!!settings.callback && typeof settings.callback === 'function') && settings.callback({ node, toggles, isOpen: Store.getState().isOpen });
    };
    if (isOpen && +settings.delay > 0) window.setTimeout(fn, +settings.delay);
    else fn();
};

/*
 * Returns an Array of HTMLElements selected based on data-toggle attribute of a given node
 * 
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements
 */
export const findToggles = node => {

    const toggleSelector = node.getAttribute('data-toggle');
    const composeSelector = classSelector => { return ACCEPTED_TRIGGERS.map(sel => `${sel}.${classSelector}`).join(", "); }

    const toggles = node.getAttribute('data-toggle') && [].slice.call(document.querySelectorAll(composeSelector(toggleSelector)));

    if (!toggles) console.warn(`Toggle cannot be initialised, no buttons or anchors found for ${node}. Does it have a data-toggle attribute that identifies toggle buttons?`);
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
 * Change toggle button attributes and node target classNames
 * 
 * @param props, Object, composed of properties of current state required to accessibly change node toggles attributes
 */
export const toggleAttributes = ({ toggles, isOpen, node, classTarget, animatingClass, statusClass, settings }) => {
    toggles.forEach(toggle => toggle.setAttribute('aria-expanded', isOpen));
    classTarget.classList.remove(animatingClass);
    classTarget.classList[isOpen ? 'add' : 'remove'](statusClass);
    if(settings.useHidden) node.hidden = !isOpen;
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
    switch (e.keyCode){
    case 27:
        e.preventDefault();
        startToggleLifecycle(Store);
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
    if (e.shiftKey && focusedIndex === 0) {
        e.preventDefault();
        focusableChildren[focusableChildren.length - 1].focus();
    } else if (!e.shiftKey && focusedIndex === focusableChildren.length - 1) {
        e.preventDefault();
        focusableChildren[0].focus();
    }
};

/*
 * Checks if the event was dispatched from a toggle button
 *
 * @param toggles, Array of toggle HTMLElements 
 * @returns Boolean, true if event was dispatched from a toggle button
 * 
 */ 
const targetIsToggle = (toggles, target) => toggles.reduce((acc, toggle) => {
    if (toggle === target|| toggle.contains(target)) acc = true;
    return acc;
}, false)

/*
 * Partially applied factory function that returns handlers for focusin and click events
 * Returned function is added as an eventListener when closeOnBlur options are true
 * 
 * @param Store, Object, model or store of the current instance
 * @returns Function, event handler
 * 
 * @param Event, event dispatched from document
 */
export const focusInListener = Store => e => {
    const state = Store.getState();
    if (!state.node.contains(e.target) && !targetIsToggle(state.toggles, e.target)) toggle(Store)();
};

/*
 * Partially applied factory function that returns handlers for focusin and click events
 * Returned function is added as an eventListener when closeOnClick options are true
 * 
 * @param Store, Object, model or store of the current instance
 * @returns Function, event handler
 * 
 * @param Event, event dispatched from document
 */
export const clickListener = Store => e => {
    const { node, toggles } = Store.getState();
    if (node.contains(e.target) || targetIsToggle(toggles, e.target)) return;
    toggle(Store)();
};

/*
 * Partially applied function that returns a function that adds and removes the document proxyListeners
 * Only added as an eventListener when closeOnBlur and/or closeOnClick options are true
 * 
 * @param Store, Object, model or state of the current instance
 */
export const closeProxy = Store => () => {
    const { settings, isOpen, focusInListener, clickListener } = Store.getState();
    if (settings.closeOnBlur) document[`${isOpen ? 'add' : 'remove'}EventListener`]('focusin', focusInListener);
    if (settings.closeOnClick) document[`${isOpen ? 'add' : 'remove'}EventListener`]('click', clickListener);
};


/*
 * Partially applied function that returns a function that sets up and pulls down focus event handlers based on toggle status and focus management options 
 * 
 * @param Store, Object, model or state of the current instance
 */
export const manageFocus = Store => () => {
    const { isOpen, focusableChildren, settings, lastFocused, keyListener } = Store.getState();
    if ((!settings.focus && !settings.trapTab) || focusableChildren.length === 0) return;
    if (isOpen){
        Store.dispatch({ lastFocused: document.activeElement });
        const focusFn = () => focusableChildren[0].focus();
        if (settings.delay) window.setTimeout(focusFn, settings.delay);
        else focusFn();
        if (!settings.trapTab) return;
        settings.trapTab && document.addEventListener('keydown', keyListener);
    } else {
        if (!settings.trapTab) return;
        document.removeEventListener('keydown', keyListener);
        const reFocusFn = () => {
            lastFocused && lastFocused.focus();
            Store.dispatch({ lastFocused: false });
        };
        if (settings.delay) window.setTimeout(reFocusFn, settings.delay);
        else reFocusFn();
    }
};

export const getStateFromDOM = (node, settings) => {
    const classTarget = settings.local ? node.parentNode : document.documentElement;
    const statusClass = settings.local ? 'is--active' : `on--${node.getAttribute('id')}`;
    return {
        classTarget,
        statusClass,
        shouldStartOpen: settings.startOpen || classTarget.classList.contains(statusClass)
    };
};

export const broadcast = Store => state => {
    const event = new CustomEvent(EVENTS[state.isOpen ? 'OPEN' : 'CLOSE'], {
        bubbles: true,
        detail: {
            getState: Store.getState
        }
    });
    state.node.dispatchEvent(event);
};
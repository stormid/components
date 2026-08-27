import { FOCUSABLE_ELEMENTS, ACCEPTED_TRIGGERS, KEYS, EVENTS } from './constants.js';
import { uid } from './utils.js';

/*
 * Renders a node as its opening tag so warnings can identify which element is misconfigured.
 * Interpolating the node itself would only ever produce '[object HTMLDivElement]'.
 *
 * @param node, HTMLElement
 * @return String
 */
const describeNode = node => {
    const id = node.getAttribute('id');
    const className = node.getAttribute('class');
    return `<${node.tagName.toLowerCase()}${id ? ` id="${id}"` : ''}${className ? ` class="${className}"` : ''}>`;
};

/*
 * Partially applied function
 * Sets aria attributes and adds eventListeners to each toggle button
 *
 * Bails without initialising if the markup the component depends on is missing, rather than
 * throwing part way through wiring the triggers up
 *
 * @param store, Object, model or state of the current instance
 * @returns Function
 */
export const initUI = store => () => {
    const { toggles, node, settings, toggleHandler, keydownHandler } = store.getState();

    //aria-controls needs an id to point at; mint one when the node has none so the triggers can
    //still reference it, rather than emitting aria-controls="null" or silently skipping the wiring
    const id = node.getAttribute('id') || (node.setAttribute('id', uid('toggle-target')), node.getAttribute('id'));
    if (toggles.length === 0) return; //findToggles has already warned

    if (settings.useHidden) node.hidden = true;

    toggles.forEach(trigger => {
        if (trigger.tagName !== 'BUTTON') {
            trigger.setAttribute('role', 'button');
            //an element given role=button is announced as a button, so it has to be reachable
            //and activate on Space the way a native button does
            if (!trigger.hasAttribute('tabindex') && !trigger.hasAttribute('href')) trigger.setAttribute('tabindex', '0');
            trigger.addEventListener('keydown', keydownHandler);
        }
        trigger.setAttribute('aria-controls', id);
        trigger.setAttribute('aria-expanded', 'false');
        trigger.addEventListener('click', toggleHandler);
    });
};

/*
 * Partially applied function
 * Dispatches a toggle action to the store
 *
 * @param store, Object, model or state of the current instance
 * @returns Function
 */
export const toggle = store => () => {
    store.update({
        ...store.getState(),
        isOpen: !store.getState().isOpen
    },
    [ toggleAttributes, manageFocus(store), closeProxy(store), broadcast(store) ]
    );
};

/*
 * Partially applied function that returns a function that begins the toggle lifecycle (prehook > toggle > callback)
 *
 * @param store, Object, model or state of the current instance
 * @returns Function
 */
export const startToggleLifecycle = store => () => {
    const state = store.getState();
    const { node, toggles, settings, isOpen, classTarget, animatingClass } = state;

    //a delayed transition is already in flight, so ignore further activations until it completes,
    //otherwise each one queues its own state change, callback and event
    if (state.transitionTimer !== null) return;

    if (typeof settings.prehook === 'function') settings.prehook({ node, toggles, isOpen });
    classTarget.classList.add(animatingClass);

    const fn = () => {
        store.update({ ...store.getState(), transitionTimer: null });
        toggle(store)();
        if (typeof settings.callback === 'function') settings.callback({ node, toggles, isOpen: store.getState().isOpen });
    };

    //delay persists the animating state on the way out only, to support exit animations
    if (isOpen && settings.delay > 0) store.update({ ...store.getState(), transitionTimer: window.setTimeout(fn, settings.delay) });
    else fn();
};

/*
 * Partially applied function that returns a keydown handler for triggers that are not native buttons
 *
 * @param store, Object, model or state of the current instance
 * @returns Function, keyboard event handler
 */
export const keydownHandler = store => e => {
    const isSpace = e.key === KEYS.SPACE || e.key === KEYS.SPACE_LEGACY;
    //an anchor with an href already activates on Enter natively, dispatching a click
    const isEnter = e.key === KEYS.ENTER && !e.currentTarget.hasAttribute('href');
    if (!isSpace && !isEnter) return;
    e.preventDefault(); //Space would otherwise scroll the page
    startToggleLifecycle(store)();
};

/*
 * Returns an Array of HTMLElements selected based on the data-toggle attribute of a given node
 *
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements, empty if none were found
 */
export const findToggles = node => {
    const toggleSelector = node.getAttribute('data-toggle');
    const composeSelector = classSelector => ACCEPTED_TRIGGERS.map(sel => `${sel}.${classSelector}`).join(', ');

    if (!toggleSelector) {
        console.warn(`Toggle cannot be initialised, ${describeNode(node)} has no data-toggle attribute naming the className of its buttons or anchors`);
        return [];
    }

    let toggles;
    try {
        toggles = Array.from(document.querySelectorAll(composeSelector(toggleSelector)));
    } catch {
        //querySelectorAll throws a SyntaxError on a data-toggle value that is not a valid CSS identifier
        console.warn(`Toggle cannot be initialised, the data-toggle value '${toggleSelector}' on ${describeNode(node)} is not a valid className`);
        return [];
    }

    if (toggles.length === 0) console.warn(`Toggle cannot be initialised, no button or anchor found with the className '${toggleSelector}' named by the data-toggle attribute of ${describeNode(node)}`);
    return toggles;
};

/*
 * Returns an Array of HTMLElements selected from a node based on the FOCUSABLE_ELEMENTS whitelist
 *
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements
 */
export const getFocusableChildren = node => Array.from(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));

/*
 * Change toggle button attributes and node target classNames
 *
 * @param props, Object, composed of properties of current state required to accessibly change button and toggle attributes
 */
export const toggleAttributes = ({ toggles, isOpen, node, classTarget, animatingClass, statusClass, settings }) => {
    toggles.forEach(trigger => trigger.setAttribute('aria-expanded', isOpen));
    classTarget.classList.remove(animatingClass);
    classTarget.classList[isOpen ? 'add' : 'remove'](statusClass);
    if (settings.useHidden) node.hidden = !isOpen;
};

/*
 * Partially applied function that returns a handler function for keydown events when toggle is open
 *
 * @param store, Object, model or store of the current instance
 * @returns Function, keyboard event handler
 *
 * @param Event, document keydown event dispatched from document
 */
export const keyListener = store => e => {
    if (!store.getState().isOpen) return;
    if (e.key === KEYS.TAB) trapTab(store, e);
};

/*
 * Checks activeElement and compares with the array of focusable elements in the target node
 * If focus has escaped the target it is pulled back to the first focusable element
 * If shift is held on the first element, focus is set on the last element
 * If on the last element, focus is set on the first element
 *
 * @param store, Object, model or store of the current instance
 * @param e, Event, document keydown event passed down from keyListener
 */
const trapTab = (store, e) => {
    const focusableChildren = store.getState().focusableChildren;
    if (focusableChildren.length === 0) return; //nothing to trap focus within
    const focusedIndex = focusableChildren.indexOf(document.activeElement);

    //focus has escaped the toggled element (e.g. onto the body) - pull it back to the first focusable
    if (focusedIndex === -1) {
        e.preventDefault();
        focusableChildren[0].focus();
    } else if (e.shiftKey && focusedIndex === 0) {
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
 * @param target, event target
 *
 * @returns Boolean, true if event was dispatched from a toggle button
 */
const targetIsToggle = (toggles, target) => toggles.some(trigger => trigger === target || trigger.contains(target));

/*
 * Closes the toggle in response to focus or a click landing outside it.
 * lastFocused is cleared first: the user has deliberately moved focus or clicked elsewhere,
 * so focus must not be pulled back to the trigger when the toggle closes.
 *
 * @param store, Object, model or store of the current instance
 */
const closeFromOutside = store => {
    store.update({ ...store.getState(), lastFocused: false });
    startToggleLifecycle(store)();
};

/*
 * Partially applied factory function that returns handlers for focusin events
 * Returned function is added as an eventListener when closeOnBlur option is true
 *
 * @param store, Object, model or store of the current instance
 * @returns Function, event handler
 *
 * @param Event, event dispatched from document
 */
export const focusInListener = store => e => {
    const { node, toggles } = store.getState();
    if (node.contains(e.target) || targetIsToggle(toggles, e.target)) return;
    closeFromOutside(store);
};

/*
 * Partially applied factory function that returns handlers for click events
 * Returned function is added as an eventListener when closeOnClick option is true
 *
 * @param store, Object, model or store of the current instance
 * @returns Function, event handler
 *
 * @param Event, event dispatched from document
 */
export const clickListener = store => e => {
    const { node, toggles } = store.getState();
    if (node.contains(e.target) || targetIsToggle(toggles, e.target)) return;
    closeFromOutside(store);
};

/*
 * Partially applied function that returns a function that adds and removes the document proxyListeners
 * Only added as an eventListener when closeOnBlur and/or closeOnClick options are true
 *
 * @param store, Object, model or state of the current instance
 */
export const closeProxy = store => () => {
    const { settings, isOpen, focusInListener, clickListener } = store.getState();
    if (settings.closeOnBlur) document[`${isOpen ? 'add' : 'remove'}EventListener`]('focusin', focusInListener);
    if (settings.closeOnClick) document[`${isOpen ? 'add' : 'remove'}EventListener`]('click', clickListener);
};

/*
 * Runs a focus change, deferring it by the delay setting so it lands after any exit animation.
 * Any focus change still pending from a previous transition is cancelled first, so the focus
 * restoration of a close cannot fire after a re-open and pull focus back out of the open element.
 *
 * @param store, Object, model or state of the current instance
 * @param fn, Function, the focus change to run
 */
const scheduleFocus = (store, fn) => {
    const { settings, focusTimer } = store.getState();
    if (focusTimer !== null) window.clearTimeout(focusTimer);

    if (settings.delay > 0) {
        const timer = window.setTimeout(() => {
            store.update({ ...store.getState(), focusTimer: null });
            fn();
        }, settings.delay);
        store.update({ ...store.getState(), focusTimer: timer });
        return;
    }

    store.update({ ...store.getState(), focusTimer: null });
    fn();
};

/*
 * Partially applied function that returns a function that sets up and pulls down focus event handlers
 * based on toggle status and focus management options
 *
 * focus and trapTab are independent: trapping tab does not imply moving focus into the element,
 * and moving focus into the element on open means returning it to where it came from on close
 *
 * @param store, Object, model or state of the current instance
 */
export const manageFocus = store => () => {
    const { isOpen, node, settings, keyListener } = store.getState();
    if (!settings.focus && !settings.trapTab) return;

    if (isOpen) {
        //recompute in case the contents of the toggled element changed after initialisation
        const focusableChildren = getFocusableChildren(node);
        const willMoveFocus = settings.focus && focusableChildren.length > 0;
        const activeElement = document.activeElement;
        //only remember where focus came from if this instance is going to move or trap it,
        //otherwise closing would pull focus back from wherever the user has since put it
        const worthRestoring = (willMoveFocus || settings.trapTab) && activeElement && activeElement !== document.body;

        store.update({
            ...store.getState(),
            focusableChildren,
            lastFocused: worthRestoring ? activeElement : false
        });

        if (settings.trapTab) document.addEventListener('keydown', keyListener);
        if (willMoveFocus) scheduleFocus(store, () => focusableChildren[0].focus());
        return;
    }

    if (settings.trapTab) document.removeEventListener('keydown', keyListener);

    const { lastFocused } = store.getState();
    if (!lastFocused) return; //focus was never moved into the element, or has deliberately moved elsewhere
    scheduleFocus(store, () => {
        lastFocused.focus();
        store.update({ ...store.getState(), lastFocused: false });
    });
};

/*
 * Resolves the className target and status className from the DOM and settings
 *
 * @param node, HTMLElement, node to be toggled
 * @param settings, Object, instance configuration
 * @return Object, classTarget, statusClass and shouldStartOpen
 */
export const getStateFromDOM = (node, settings) => {
    const id = node.getAttribute('id');
    const classTarget = settings.local ? node.parentNode : document.documentElement;
    //without an id there is no id-derived className available, so fall back to the generic
    //active className rather than interpolating null into it
    const statusClass = settings.local || !id ? 'is--active' : `on--${id}`;
    return {
        classTarget,
        statusClass,
        shouldStartOpen: settings.startOpen || classTarget.classList.contains(statusClass)
    };
};

/*
 * Dispatches a bubbling custom event on the toggled node, carrying a reference to getState
 *
 * @param store, Object, model or state of the current instance
 */
export const broadcast = store => state => {
    const event = new CustomEvent(EVENTS[state.isOpen ? 'OPEN' : 'CLOSE'], {
        bubbles: true,
        detail: {
            getState: store.getState
        }
    });
    state.node.dispatchEvent(event);
};

import { createStore } from './store';
import { TRIGGER_EVENTS, TRIGGER_KEYCODES } from './constants';
import {
    findToggles,
    toggleAttributes,
    getFocusableChildren,
    keyListener,
    closeOnBlur,
    focusInListener,
    manageFocus
} from './dom';

/*
 * Dispatches a toggle action to the Store
 * 
 * @param Store, Object, model or state of the current instance
 */
const toggle = Store => () => {
    Store.dispatch({ isOpen: !Store.getState().isOpen }, [toggleAttributes, manageFocus(Store), closeOnBlur(Store)]);
};

/*
 * Partially applied function that returns a function that being sthe toggle lifecycle (prehook > toggle > callback)
 * 
 * @param Store, Object, model or state of the current instance
 * @returns Function
 */
const startToggleCycle = Store => () => {
    const { node, toggles, settings, isOpen, classTarget, animatingClass } = Store.getState();
    (settings.prehook && typeof settings.prehook === 'function') && settings.prehook({ node, toggles, isOpen });		
    classTarget.classList.add(animatingClass);
    const fn = () => {
        toggle(Store)();
        (!!settings.callback && typeof settings.callback === 'function') && settings.callback({ node, toggles, isOpen: Store.getState().isOpen });
    };
    if(isOpen && settings.delay > 0) window.setTimeout(fn, settings.delay);
    else fn();
};

/*
 * Sets aria attributes and adds eventLIstener on each toggle button
 * 
 * @param Store, Object, model or state of the current instance
 */
const initToggles = Store => {
    const { toggles, node } = Store.getState();

    toggles.forEach(toggle => {
        if(toggle.tagName !== 'BUTTON') toggle.setAttribute('role', 'button');
        const id = node.getAttribute('id');
        if(!id) throw console.warn(`${node} should have an id.`);
        toggle.setAttribute('aria-controls', id);
        toggle.setAttribute('aria-expanded', 'false');
        TRIGGER_EVENTS.forEach(ev => {
            toggle.addEventListener(ev, e => {
                if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3)) return;
                e.preventDefault();
                startToggleCycle(Store)();
            });
        });
    });
};


/* 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Toggle API
 */
export default ({ node, settings }) => {
    const Store = createStore();
    //set initial state of Store
    Store.dispatch({
        node,
        settings,
        toggles: findToggles(node),
        isOpen: false,
        classTarget: settings.local ? node.parentNode : document.documentElement,
        statusClass: settings.local ? 'is--active' : `on--${node.getAttribute('id')}`,
        animatingClass: settings.local ? `animating--${node.getAttribute('id')}` : 'is--animating',
        focusableChildren: getFocusableChildren(node),
        lastFocused: false,
        keyListener: keyListener(Store),
        focusInListener: focusInListener(Store)
    });
    initToggles(Store);
	settings.startOpen && startToggleCycle(Store)();

    return { 
        node,
        startToggleCycle: startToggleCycle(Store),
        toggle: toggle(Store)
    }
}; 
import { createStore } from './store.js';
import {
    findToggles,
    getFocusableChildren,
    keyListener,
    keydownHandler,
    focusInListener,
    clickListener,
    initUI,
    startToggleLifecycle,
    toggle,
    getStateFromDOM
} from './dom.js';

/*
 * @param settings, Object, merged defaults + options
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Toggle API
 */
export default ({ node, settings }) => {
    const store = createStore();
    const id = node.getAttribute('id');
    //resolve state from DOM
    const { classTarget, statusClass, shouldStartOpen } = getStateFromDOM(node, settings);
    //single, stable handlers shared by every trigger so the listeners can be removed again in destroy()
    const toggleHandler = e => {
        e.preventDefault();
        startToggleLifecycle(store)();
    };

    //set initial state of store
    store.update({
        node,
        settings,
        toggles: findToggles(node),
        isOpen: false,
        classTarget,
        statusClass,
        animatingClass: settings.local && id ? `animating--${id}` : 'is--animating',
        focusableChildren: getFocusableChildren(node),
        lastFocused: false,
        transitionTimer: null, //a delayed close awaiting its exit animation
        focusTimer: null, //a delayed focus change awaiting its animation
        toggleHandler,
        keydownHandler: keydownHandler(store),
        keyListener: keyListener(store),
        focusInListener: focusInListener(store),
        clickListener: clickListener(store)
    }, [ initUI(store), () => {
        shouldStartOpen && startToggleLifecycle(store)();
    }]);

    return {
        node,
        startToggle: startToggleLifecycle(store),
        toggle: toggle(store),
        getState: store.getState,
        destroy() {
            const state = store.getState();
            //cancel a delayed close already in flight so its queued transition cannot run after teardown
            if (state.transitionTimer !== null) window.clearTimeout(state.transitionTimer);
            store.update({ ...state, transitionTimer: null });
            const lastFocused = state.lastFocused;

            //close first, so the status className, hidden attribute and document listeners are cleaned up.
            //toggle rather than the lifecycle: teardown should not fire the prehook and callback,
            //nor be deferred by the delay setting; silent so it does not dispatch a spurious toggle.close
            if (store.getState().isOpen) toggle(store)(true);

            //closing may have scheduled a delayed focus restoration - cancel it and restore
            //synchronously instead, so destroy leaves nothing pending behind
            const closed = store.getState();
            if (closed.focusTimer !== null) window.clearTimeout(closed.focusTimer);
            store.update({ ...closed, focusTimer: null, lastFocused: false });
            if (lastFocused) lastFocused.focus();

            const finalState = store.getState();
            finalState.toggles.forEach(trigger => {
                trigger.removeEventListener('click', finalState.toggleHandler);
                trigger.removeEventListener('keydown', finalState.keydownHandler);
            });
            document.removeEventListener('keydown', finalState.keyListener);
            document.removeEventListener('focusin', finalState.focusInListener);
            document.removeEventListener('click', finalState.clickListener);
        }
    };
};

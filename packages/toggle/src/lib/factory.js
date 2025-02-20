import { createStore } from './store';
import {
    findToggles,
    getFocusableChildren,
    keyListener,
    focusInListener,
    clickListener,
    initUI,
    startToggleLifecycle,
    toggle,
    getStateFromDOM
} from './dom';


/* 
 * @param settings, Object, merged defaults + options
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Toggle API
 */
export default ({ node, settings }) => {
    const store = createStore();
    //resolve state from DOM
    const { classTarget, statusClass, shouldStartOpen } = getStateFromDOM(node, settings);
    //set initial state of store
    store.update({
        node,
        settings,
        toggles: findToggles(node),
        isOpen: false,
        classTarget,
        statusClass,
        animatingClass: settings.local ? `animating--${node.getAttribute('id')}` : 'is--animating',
        focusableChildren: getFocusableChildren(node),
        lastFocused: false,
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
        getState: store.getState
    };
};
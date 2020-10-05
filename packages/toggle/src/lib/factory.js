import { createStore } from './store';
import {
    findToggles,
    getFocusableChildren,
    keyListener,
    proxyListener,
    initUI,
    startToggleLifecycle,
    toggle,
    getStateFromDOM
} from './dom';


/* 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Toggle API
 */
export default ({ node, settings }) => {
    const Store = createStore();
    //resolve state from DOM
    const { classTarget, statusClass, shouldStartOpen } = getStateFromDOM(node, settings);
    //set initial state of Store
    Store.dispatch({
        node,
        settings,
        toggles: findToggles(node),
        isOpen: false,
        classTarget,
        statusClass,
        animatingClass: settings.local ? `animating--${node.getAttribute('id')}` : 'is--animating',
        focusableChildren: getFocusableChildren(node),
        lastFocused: false,
        keyListener: keyListener(Store),
        focusInListener: proxyListener(Store),
        clickListener: proxyListener(Store)
    }, [ initUI(Store), () => {
	    shouldStartOpen && startToggleLifecycle(Store)();
    }]);


    return {
        node,
        startToggle: startToggleLifecycle(Store),
        toggle: toggle(Store),
        getState: Store.getState
    };
};
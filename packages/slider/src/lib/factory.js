import { createStore } from './store';
import {
    findToggles,
    getFocusableChildren,
    keyListener,
    proxyListener,
    initUI,
    startToggleLifecycle,
    toggle
} from './dom';


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
        focusInListener: proxyListener(Store),
        clickListener: proxyListener(Store)
    }, [ initUI(Store), () => {
	    settings.startOpen && startToggleLifecycle(Store)();
    }]);


    return {
        node,
        startToggle: startToggleLifecycle(Store),
        toggle: toggle(Store),
        getState: Store.getState
    };
};
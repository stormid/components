import { createStore } from './store';
import { findDialog, findToggles, initUI, getFocusableChildren } from './dom';


/* 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Toggle API
 */
export default ({ node, settings }) => {
    const Store = createStore();
    
    Store.dispatch({
        settings,
        node,
        dialog: findDialog(node),
        toggles: findToggles(node, settings),
        focusableChildren: getFocusableChildren(node),
        lastFocused: false,
        isOpen: false
    }, [ initUI(Store) ]);

    return {
        getState: Store.getState
    }
}; 
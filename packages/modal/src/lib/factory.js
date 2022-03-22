import { createStore } from './store';
import {
    findDialog,
    findToggles,
    initUI,
    getFocusableChildren,
    keyListener,
    lifecycle
} from './dom';


/* 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Modal API
 */
export default ({ node, settings }) => {
    const Store = createStore();
    
    Store.dispatch({
        settings,
        node,
        dialog: findDialog(node),
        toggles: findToggles(node, settings),
        focusableChildren: getFocusableChildren(node),
        keyListener: keyListener(Store),
        lastFocused: false,
        isOpen: false
    }, [
        initUI(Store),
        () => settings.startOpen && lifecycle(Store)
    ]);

    return {
        getState: Store.getState,
        open() {
            if (Store.getState().isOpen) return;
            lifecycle(Store);
        },
        close() {
            if (!Store.getState().isOpen) return;
            lifecycle(Store);
        }
    };
};
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
    const store = createStore();
    
    store.update({
        settings,
        node,
        dialog: findDialog(node),
        toggles: findToggles(node, settings),
        focusableChildren: getFocusableChildren(node),
        keyListener: keyListener(store),
        lastFocused: false,
        isOpen: false
    }, [
        initUI(store),
        () => settings.startOpen && lifecycle(store)
    ]);

    return {
        getState: store.getState,
        open() {
            if (store.getState().isOpen) return;
            lifecycle(store);
        },
        close() {
            if (!store.getState().isOpen) return;
            lifecycle(store);
        }
    };
};
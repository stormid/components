import { createStore } from './store.js';
import {
    findDialog,
    findToggles,
    initUI,
    getFocusableChildren,
    keyListener,
    lifecycle
} from './dom.js';

export default ({ node, settings }) => {
    const store = createStore();
    // single, stable click handler shared by every toggle so it can be removed again in destroy()
    const toggleHandler = e => {
        e.preventDefault();
        lifecycle(store);
    };

    store.update({
        settings,
        node,
        dialog: findDialog(node),
        toggles: findToggles(node, settings),
        focusableChildren: getFocusableChildren(node),
        keyListener: keyListener(store),
        toggleHandler,
        lastFocused: false,
        isOpen: false,
        inerted: [], // background siblings this instance has made inert while open
        originalParent: null, // node's DOM position, captured on open so it can be restored on close
        originalNextSibling: null
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
        },
        destroy() {
            const state = store.getState();
            if (state.isOpen) lifecycle(store); // close first to restore inert siblings, node position and focus
            (state.toggles || []).forEach(tgl => tgl.removeEventListener('click', state.toggleHandler));
            document.removeEventListener('keydown', state.keyListener);
        }
    };
};
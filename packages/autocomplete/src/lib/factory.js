import { createStore } from './store.js';
import {
    input,
    // output,
    list,
    status,
    listen
} from './dom.js';
import {
    inputFocus, inputBlur, inputChange,
    optionClick, optionBlur, optionMouseDown,
    keydown, clear
} from './handle.js';
import { defaultSearch, uid } from './utils.js';

export default ({ node, settings }) => {
    const store = createStore();

    // The node's id (if any) moves onto the input, so derive ids before build.
    const id = node.getAttribute('id') || settings.id || uid('autocomplete');
    const listId = `${id}-listbox`;

    // Normalise the search fn up front so handlers can always call settings.search.
    settings.search = settings.search || defaultSearch(settings.values);

    store.update({
        settings,
        dom: {
            node,
            input: input({ node, settings, id, listId }),
            list: list({ node, id: listId, labelledby: id }),
            status: status(node)
        },
        selected: null,
        open: false,
        options: settings.list || [],
        handle: {
            container: { keydown: keydown(store) },
            input: {
                focus: inputFocus(store),
                blur: inputBlur(store),
                input: inputChange(store)
            },
            option: {
                click: optionClick(store),
                blur: optionBlur(store),
                mousedown: optionMouseDown
            }
        }
    }, [
        listen
    ]);

    return {
        node,
        getState: store.getState,
        clear: clear(store)
    };
};
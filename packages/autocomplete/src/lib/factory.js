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
    keydown
} from './handle.js';
import { defaultSearch } from './utils.js';

export default ({ node, settings }) => {
    const store = createStore();
    
    store.update({
        settings,
        dom: {
            node,
            select: node.querySelector('select'),
            input: input({ node, settings }),
            list: list(node, node.id),
            status: status(node),
            // output: output({ node, settings }) //list of hidden inputs, single hidden input, or get from setting.output
        },
        selected: null,
        open: false,
        options: settings.list || [],
        search: settings.search || defaultSearch(settings.values),
        handle: { //or just delegate everything?
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
        listen,
    ]);

    return {
        getState: store.getState,
        //clear - dispatch update to store, remove selected, close list, clear options, clear dom elements
    };
};
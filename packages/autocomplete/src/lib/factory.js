import { createStore } from './store.js';
import defaults from './defaults.js';
import {
    input,
    output,
    list,
    status,
    listen,
    setValue,
    syncOutput,
    hiddenValue
} from './dom.js';
import {
    inputFocus, inputBlur, inputChange,
    optionClick, optionBlur, optionMouseDown,
    chipRemove, keydown, clear
} from './handle.js';
import { defaultSearch, filterOptions, fromSelect, uid } from './utils.js';

export default ({ node, settings }) => {
    const store = createStore();

    //single mode carries one selection (or null); multiple accumulates an array
    let selected = settings.multiple ? [] : null;

    //progressive enhancement: when the node wraps a <select>, source the options
    //from its <option>s and adopt its name/multiple, then remove it below — the
    //combobox carries the form value from here on.
    const select = node.querySelector('select');
    if (select) {
        const selectSource = fromSelect(select);
        settings.multiple = settings.multiple || selectSource.multiple;
        settings.name = settings.name || selectSource.name;
        settings.list = selectSource.options;
        //<option> display text is the label, its value the submit value
        if (settings.template === defaults.template) settings.template = option => option.label;
        settings.search = settings.search || filterOptions(selectSource.options, settings.template);
        selected = settings.multiple ? selectSource.selected : (selectSource.selected[selectSource.selected.length - 1] || null);
    }

    // The id moves onto the input; prefer the <select>'s so an existing
    // <label for> keeps its association after enhancement.
    const id = (select && select.getAttribute('id')) || node.getAttribute('id') || settings.id || uid('autocomplete');
    const listId = `${id}-listbox`;

    if (select) select.remove();

    // Single mode submits via a hidden value field (when there's a name to submit
    // under), freeing the visible input to display the option label (template)
    // while the form receives the value (extractValue) — see setValue / hiddenValue.
    const usesHiddenValue = !settings.multiple && !!settings.name;

    // Normalise the search fn up front so handlers can always call settings.search.
    settings.search = settings.search || defaultSearch(settings.values);

    // Seed an initial selection from a server-rendered value/label pair (e.g. a
    // restored or pre-filled form): data-value/data-label on the node, or value/
    // label options. Multiple mode accepts arrays (one chip per pair). The setValue
    // (single) / syncOutput (multiple) seed below then shows the label(s) via the
    // template and submits the value(s) via the hidden field(s), so a restored
    // value behaves exactly like a user-picked one. Uses the { value, label } option
    // shape; a <select>'s own pre-selected options take precedence, and a missing
    // label falls back to the value for display.
    if (settings.value !== undefined && settings.value !== null && settings.value !== '') {
        if (settings.multiple && !selected.length) {
            const values = [].concat(settings.value);
            const labels = [].concat(settings.label ?? []);
            selected = values.map((value, i) => ({ value, label: labels[i] ?? value }));
        } else if (!settings.multiple && !selected) {
            selected = { value: settings.value, label: settings.label ?? settings.value };
        }
    }

    // Seed the DOM from any initial selection (from the <select> or the value above).
    const seed = [];
    if (!settings.multiple && selected) seed.push(setValue);
    if (settings.multiple && selected.length) seed.push(syncOutput);

    store.update({
        settings,
        dom: {
            node,
            input: input({ node, settings, id, listId }),
            list: list({ node, id: listId, labelledby: id }),
            status: status(node),
            //chips + hidden fields live in the output list, multiple mode only
            ...(settings.multiple ? { output: output({ node }) } : {}),
            //single mode: a hidden field carries the submit value under the name
            ...(usesHiddenValue ? { hidden: hiddenValue({ node, name: settings.name }) } : {})
        },
        selected,
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
            },
            chip: { remove: chipRemove(store) }
        }
    }, [
        listen,
        ...seed
    ]);

    return {
        node,
        getState: store.getState,
        clear: clear(store)
    };
};
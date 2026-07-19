import { createStore } from './store.js';
import defaults from './defaults.js';
import {
    createInput,
    createOutput,
    createList,
    createStatus,
    createHint,
    setupListeners,
    setValue,
    syncOutput,
    createHiddenValue
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
        if (settings.displayTemplate === defaults.displayTemplate) settings.displayTemplate = option => option.label;
        settings.search = settings.search || filterOptions(selectSource.options, settings.displayTemplate);
        selected = settings.multiple ? selectSource.selected : (selectSource.selected[selectSource.selected.length - 1] || null);
    }

    // The id moves onto the input; prefer the <select>'s so an existing
    // <label for> keeps its association after enhancement.
    const id = (select && select.getAttribute('id')) || node.getAttribute('id') || settings.id || uid('autocomplete');
    const listId = `${id}-listbox`;
    // A minlength above one carries a "type N or more characters" requirement, so
    // expose it as a visually-hidden hint linked to the input via aria-describedby.
    const usesHint = Number(settings.minlength) > 1;
    const hintId = `${id}-hint`;

    if (select) select.remove();

    // Single mode submits via a hidden value field (when there's a name to submit
    // under), freeing the visible input to display the option label (displayTemplate)
    // while the form receives the value (submissionTemplate) — see setValue / createHiddenValue.
    const usesHiddenValue = !settings.multiple && !!settings.name;

    // Normalise the search function up front so handlers can always call settings.search.
    settings.search = settings.search || defaultSearch(settings.values);

    // Seed an initial selection from a server-rendered value/label pair (e.g. a
    // restored or pre-filled form): data-value/data-label on the node, or value/
    // label options. Multiple mode accepts arrays (one chip per pair). The setValue
    // (single) / syncOutput (multiple) seed below then shows the label(s) via the
    // displayTemplate and submits the value(s) via the hidden field(s), so a restored
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
            input: createInput({ node, settings, id, listId, describedby: usesHint ? hintId : null }),
            list: createList({ node, id: listId, labelledby: id }),
            status: createStatus(node),
            //minlength requirement, announced on focus via aria-describedby
            ...(usesHint ? { hint: createHint({ node, id: hintId, settings }) } : {}),
            //chips + hidden fields live in the output list, multiple mode only
            //(added to the DOM by syncOutput only once there's a chip to show)
            ...(settings.multiple ? { output: createOutput() } : {}),
            //single mode: a hidden field carries the submit value under the name
            ...(usesHiddenValue ? { hidden: createHiddenValue({ node, name: settings.name }) } : {})
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
        setupListeners,
        ...seed
    ]);

    return {
        node,
        getState: store.getState,
        clear: clear(store)
    };
};
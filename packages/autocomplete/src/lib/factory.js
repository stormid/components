import { createStore } from './store.js';
import defaults from './defaults.js';
import {
    createInput,
    createOutput,
    createList,
    createStatus,
    createHint,
    createSelectionSummary,
    setupListeners,
    setValue,
    syncOutput,
    createHiddenValue
} from './dom.js';
import {
    inputFocus, inputBlur, inputChange,
    optionClick, optionMouseDown,
    chipRemove, keydown, clear, resetForm
} from './handle.js';
import { fromValues, filterOptions, fromSelect, uid } from './utils.js';

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

    //progressive enhancement: when the node already contains a server-rendered <input>
    //(a real, submittable field that works with JS off — the no-JS fallback for a
    //search/free-text control), enhance that element in place rather than build a fresh
    //one. Adopt its name (moved onto the hidden value field by createInput) and any
    //restored value, then let the value seed below treat it like a data-value selection.
    const preInput = !select && node.querySelector('input');
    if (preInput) {
        settings.name = settings.name || preInput.getAttribute('name');
        //single mode restores the input's value as the initial selection (like data-value).
        //Multiple mode can't carry several values in one field, so it degrades to a plain
        //search input — its server value is left as ordinary typed text rather than being
        //turned into a lone chip; multi-value restore is <select multiple> / the value option.
        if (!settings.multiple && preInput.value && (settings.value === undefined || settings.value === null)) settings.value = preInput.value;
    }

    // The id moves onto the input; prefer the <select>'s (or an enhanced input's own id)
    // so an existing <label for> keeps its association after enhancement.
    const id = (select && select.getAttribute('id')) || (preInput && preInput.getAttribute('id')) || node.getAttribute('id') || settings.id || uid('autocomplete');
    const listId = `${id}-listbox`;
    // The listbox takes its accessible name from the field's <label>; pointing it at the
    // input would resolve the name to the typed value instead. Give the label an id if it
    // has none, and fall back to the input only when there's no associated label.
    const label = document.querySelector(`label[for="${id}"]`);
    if (label && !label.id) label.setAttribute('id', `${id}-label`);
    const listLabelledby = label ? label.id : id;
    // A minlength above one carries a "type N or more characters" requirement, so
    // expose it as a visually-hidden hint linked to the input via aria-describedby.
    const usesHint = Number(settings.minlength) > 1;
    const hintId = `${id}-hint`;
    // Multiple mode: a visually-hidden summary of the current selection, also linked
    // via aria-describedby, so refocusing the input announces what's already chosen.
    const selectionId = `${id}-selection`;
    // aria-describedby may carry both ids (space-separated), whichever apply.
    const describedby = [ usesHint ? hintId : null, settings.multiple ? selectionId : null ].filter(Boolean).join(' ') || null;

    if (select) select.remove();

    // Single mode submits via a hidden value field (when there's a name to submit
    // under), freeing the visible input to display the option label (displayTemplate)
    // while the form receives the value (submissionTemplate) — see setValue / createHiddenValue.
    const usesHiddenValue = !settings.multiple && !!settings.name;

    // Normalise the search function up front so handlers can always call settings.search.
    // With no explicit search, build one from `values`: normalise the entries (strings
    // or { value, label } objects) to the option shape and match with the object-aware
    // filterOptions, so the default option.value templates render and submit correctly.
    settings.search = settings.search || filterOptions(fromValues(settings.values), settings.displayTemplate);

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

    // Snapshot the initial selection so a form reset can restore it (like a native
    // <select> returning to its default) — see resetForm.
    const selectedInitial = settings.multiple ? [ ...selected ] : selected;

    store.update({
        settings,
        dom: {
            node,
            input: createInput({ node, settings, id, listId, describedby, input: preInput || undefined }),
            list: createList({ node, id: listId, labelledby: listLabelledby }),
            status: createStatus(node),
            //minlength requirement, announced on focus via aria-describedby
            ...(usesHint ? { hint: createHint({ node, id: hintId, settings }) } : {}),
            //chips + hidden fields live in the output list, multiple mode only
            //(added to the DOM by syncOutput only once there's a chip to show)
            ...(settings.multiple ? { output: createOutput() } : {}),
            //visually-hidden selection summary, linked via aria-describedby, so the
            //current chips are announced when the input is (re)focused (multiple mode)
            ...(settings.multiple ? { selectionSummary: createSelectionSummary({ node, id: selectionId }) } : {}),
            //single mode: a hidden field carries the submit value under the name
            ...(usesHiddenValue ? { hidden: createHiddenValue({ node, name: settings.name }) } : {})
        },
        selected,
        selectedInitial,
        open: false,
        //index of the highlighted option (-1 = caret in the input, nothing highlighted);
        //reflected onto the DOM as aria-activedescendant / aria-selected by renderActive
        active: -1,
        options: settings.list || [],
        handle: {
            container: { keydown: keydown(store) },
            form: { reset: resetForm(store) },
            input: {
                focus: inputFocus(store),
                blur: inputBlur(store),
                input: inputChange(store)
            },
            option: {
                click: optionClick(store),
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
import { emptyList, renderList, renderStatus, clearStatus, showList, hideList, setValue, clearInput, focusInput, syncOutput } from './dom.js';
import { areEqual, isPrintableKeyCode } from './utils.js';
import { KEYCODES } from './constants.js';

//resolve the option an event fired from via its aria-posinset
const optionAt = (options, target) => options[Number(target.getAttribute('aria-posinset')) - 1];

//multiple: add the option, or remove it if already selected (toggle-select)
const toggleSelection = ({ selected, settings }, option) => {
    const value = settings.extractValue(option);
    return selected.some(item => settings.extractValue(item) === value)
        ? selected.filter(item => settings.extractValue(item) !== value)
        : [ ...selected, option ];
};

/*
 * Commit a selection and close the list. Single mode replaces the selection and
 * writes it to the input; multiple mode toggles it into the chip list, clears
 * the search input and (when refocus) keeps focus in the input to keep typing.
 */
const commit = (store, option, refocus = false) => {
    const state = store.getState();
    if (state.settings.multiple) {
        //clear the results so retyping the same query re-renders the (now emptied) list
        const effects = [ clearInput, syncOutput, hideList, emptyList, clearStatus ];
        if (refocus) effects.push(focusInput);
        store.update({ ...state, selected: toggleSelection(state, option), options: [], open: false }, effects);
    } else {
        store.update({ ...state, selected: option, open: false }, [ setValue, hideList, emptyList, renderStatus ]);
    }
};

export const keydown = store => event => {
    switch (KEYCODES[event.keyCode]) {
    case 'up':
        handleUpArrow(store, event);
        break;
    case 'down':
        handleDownArrow(store, event);
        break;
    case 'space':
        handleSpace(store, event);
        break;
    case 'enter':
        handleEnter(store, event);
        break;
    case 'escape':
        handleEscape(store);
        break;
    case 'tab':
        handleBlur(store, event);
        break;
    case 'backspace':
        handleBackspace(store, event);
        break;
    default:
        if (isPrintableKeyCode(event.keyCode)) handlePrintableKey(store, event);
        break;
    }
};

const handlePrintableKey = (store, event) => {
    const { dom } = store.getState();
    if (event.target !== dom.input) dom.input.focus();
};

//multiple: Backspace on an empty input removes the last chip; otherwise it
//behaves like any editing key (bring focus back to the input from an option)
const handleBackspace = (store, event) => {
    const { dom, settings, selected } = store.getState();
    if (settings.multiple && event.target === dom.input && dom.input.value === '' && selected.length) {
        store.update({ ...store.getState(), selected: selected.slice(0, -1) }, [ syncOutput ]);
        return;
    }
    if (event.target !== dom.input) dom.input.focus();
};

const handleBlur = (store, event) => {
    const { dom, open, settings, options  } = store.getState();
    if (!open && event.target.parentElement !== dom.list) return;
    if (settings.confirmOnBlur) commit(store, optionAt(options, event.target));
};

const handleEnter = (store, event) => {
    const { open, dom, options } = store.getState();
    if (!open && event.target.parentElement !== dom.list) return;
    event.preventDefault();
    commit(store, optionAt(options, event.target), true);
};

const handleSpace = (store, event) => {
    const { open, dom, settings, options } = store.getState();
    //if event is fired from the input, and the list is closed, and it's there is no query, open it
    //if settings.list is empty then the options are being loaded dynamically, so do nothing
    if (event.target === dom.input && !open && !!settings.list && dom.input.value === '') {
        event.preventDefault();
        store.update({ ...store.getState(), options: settings.list, open: true }, [ renderList, clearStatus ]);
        return;
    }
    //if event is fired from an option, select it
    if (event.target.parentElement === dom.list) {
        event.preventDefault();
        commit(store, optionAt(options, event.target), true);
    }
};


const handleEscape = store => {
    const { open, dom } = store.getState();
    if (!open) return;
    document.activeElement.setAttribute('aria-selected', 'false');
    dom.input.focus();
    store.update({ ...store.getState(), open: false }, [ hideList, clearStatus ]);
};

const handleUpArrow = (store, event) => {
    event.preventDefault();
    const { dom, open } = store.getState();
    if (document.activeElement === dom.input || !open) return;
    document.activeElement.setAttribute('aria-selected', 'false');
    if (document.activeElement.previousElementSibling) {
        document.activeElement.previousElementSibling.focus();
        document.activeElement.setAttribute('aria-selected', 'true');
    } else dom.input.focus();
};

const handleDownArrow = (store, event) => {
    event.preventDefault();
    const { dom, open } = store.getState();
    if (!open || !document.activeElement.nextElementSibling) return;
    if (document.activeElement === dom.input && open) {
        dom.list.firstElementChild.focus();
    } else {
        document.activeElement.setAttribute('aria-selected', 'false');
        document.activeElement.nextElementSibling.focus();
    }
    document.activeElement.setAttribute('aria-selected', 'true');
};

export const inputFocus = store => event => {
    const { open, selected, settings } = store.getState();
    if (!event.target.value) return;
    //single mode: the input shows the current selection, don't reopen for it
    if (!settings.multiple && selected && settings.template(selected) === event.target.value) return;
    if (!open) store.update({ ...store.getState(), open: true }, [ showList ]);
};

export const inputBlur = store => event => {
    const { dom, open, settings  } = store.getState();
    if (dom.list.contains(document.activeElement) || dom.list.contains(event.relatedTarget)) return;
    if (open) {
        if (settings.clearOnBlur) dom.input.value = '';
        store.update({ ...store.getState(), open: false, ...(settings.clearOnBlur ? { options: [] } : {}) }, [ renderList, clearStatus ]);
    }
};

export const inputChange = store => event => {
    const { settings, open, options, selected } = store.getState();
    const value = event.target.value;
    //single mode: editing the input away from the shown selection clears it
    if (!settings.multiple && selected && settings.template(selected) !== value) store.update({ ...store.getState(), selected: null }, [ clearStatus ]);
    if (value.length < settings.minlength) {
        if (open) store.update({ ...store.getState(), open: false }, [ hideList ]);
        if (options.length) store.update({ ...store.getState(), options: [] }, [ emptyList, renderStatus ]);
        return;
    }
    const results = settings.search(value);
    if (results.length === 0 && areEqual(options, results)) return;
    if (results.length && areEqual(options, results)) {
        if (!open) store.update({ ...store.getState(), open: true }, [ showList ]);
        return;
    }
    store.update({ ...store.getState(), options: results, open: results.length > 0 }, [ renderList, renderStatus ]);
};

export const optionClick = store => event => {
    const { options } = store.getState();
    commit(store, optionAt(options, event.target), true);
};

export const optionBlur = store => event => {
    const { dom, open, settings, options } = store.getState();
    //ignore focus moving elsewhere inside the component (another option or the input)
    if (dom.node.contains(event.relatedTarget)) return;
    //already closed (e.g. a selection just committed and emptied the list)
    if (!open) return;
    if (settings.confirmOnBlur) commit(store, optionAt(options, event.target));
    else store.update({ ...store.getState(), open: false }, [ hideList, clearStatus ]);
};

export const optionMouseDown = event => {
    // Safari triggers focusOut before click, but if you
    // preventDefault on mouseDown, you can stop that from happening.
    // If this is removed, clicking on an option in Safari will trigger
    // `handleOptionBlur`, which closes the menu, and the click will
    // trigger on the element underneath instead.
    // See: http://stackoverflow.com/questions/7621711/how-to-prevent-blur-running-when-clicking-a-link-in-jquery
    event.preventDefault();
};

export const clear = store => () => {
    const state = store.getState();
    if (state.settings.multiple) store.update({ ...state, selected: [], options: [], open: false }, [ clearInput, syncOutput, hideList, emptyList, clearStatus ]);
    else store.update({ ...state, selected: null, options: [], open: false }, [ setValue, hideList, emptyList, clearStatus ]);
};

export const chipRemove = store => event => {
    const button = event.target.closest('.autocomplete__chip-remove');
    //ignore clicks anywhere on the output that aren't a remove button
    if (!button) return;
    const state = store.getState();
    const value = button.dataset.value;
    store.update({ ...state, selected: state.selected.filter(item => String(state.settings.extractValue(item)) !== value) }, [ syncOutput, focusInput ]);
};
import { emptyList, renderList, renderStatus, clearStatus, showList, hideList, showLoading, setValue, clearInput, focusInput, syncOutput, syncHiddenValue, broadcast } from './dom.js';
import { areEqual, debounce, isPrintableKeyCode } from './utils.js';
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
    //nothing to commit — e.g. a click/blur/keypress landed while the list only
    //held the non-selectable no-results message (optionAt returns undefined)
    if (!option) return;
    const state = store.getState();
    if (state.settings.multiple) {
        //clear the results so retyping the same query re-renders the (now emptied) list
        const effects = [ clearInput, syncOutput, hideList, emptyList, clearStatus ];
        if (refocus) effects.push(focusInput);
        store.update({ ...state, selected: toggleSelection(state, option), options: [], open: false }, effects);
    } else {
        store.update({ ...state, selected: option, open: false }, [ setValue, hideList, emptyList, renderStatus ]);
    }
    broadcast(store, 'confirm', option);
};

// ignore requests whose query no longer matches current user input - ensures latest keystroke wins
// if user has typed after original request fired

const resolveAsyncResults = (store, value, results) => {
    const state = store.getState();
    if (state.dom.input.value !== value) return;
    //open regardless of count: empty results show the no-results message, so the
    //list is never left silently shut after a search has run
    store.update({ ...state, options: results, open: true }, [ renderList, renderStatus ]);
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
        const removed = selected[selected.length - 1];
        store.update({ ...store.getState(), selected: selected.slice(0, -1) }, [ syncOutput ]);
        broadcast(store, 'remove', removed);
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
    //no selectable options (e.g. the list is showing the no-results message) —
    //leave Enter alone so a normal form submit isn't swallowed
    if (options.length === 0) return;
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
    const { dom, open, options } = store.getState();
    //no real options to move onto (the no-results message isn't focusable)
    if (!open || options.length === 0 || !document.activeElement.nextElementSibling) return;
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
    //single mode: the input shows the current selection, don't reopen for it —
    //select its text instead so the next keystroke replaces the whole value
    if (!settings.multiple && selected && settings.template(selected) === event.target.value) return event.target.select();
    if (!open) store.update({ ...store.getState(), open: true }, [ showList ]);
};

export const inputBlur = store => event => {
    const { dom, open, settings  } = store.getState();
    if (dom.list.contains(document.activeElement) || dom.list.contains(event.relatedTarget)) return;
    if (open) {
        if (settings.clearOnBlur) dom.input.value = '';
        //clearOnBlur blanks the field; in single mode also drop the selection and
        //sync its hidden value, so a blanked field can't leave a stale value behind
        //in state or the form
        const dropSelection = settings.clearOnBlur && !settings.multiple;
        store.update(
            { ...store.getState(), open: false, ...(settings.clearOnBlur ? { options: [] } : {}), ...(dropSelection ? { selected: null } : {}) },
            dropSelection ? [ renderList, clearStatus, syncHiddenValue ] : [ renderList, clearStatus ]
        );
    }
};

export const inputChange = store => {
    //async mode: debounce the remote search so a request fires once the user
    //pauses, not on every keystroke. The timer lives in this closure across the
    //instance's lifetime (inputChange runs once per instance at build time).
    //controller aborts the in-flight request when a newer query supersedes it —
    //search receives the signal as a second argument to pass to fetch.
    let controller = null;
    const runAsyncSearch = debounce(value => {
        const state = store.getState();
        //the input may have changed during the debounce window — skip a stale query
        if (state.dom.input.value !== value) return;
        if (controller) controller.abort();
        controller = new AbortController();
        showLoading(state);
        state.settings.search(value, controller.signal)
            .then(results => resolveAsyncResults(store, value, results))
            .catch(error => {
                //a superseded request aborts by design — leave the newer one to render
                if (error && error.name === 'AbortError') return;
                console.warn(`Autocomplete search failed for query '${value}': ${error}`);
                resolveAsyncResults(store, value, []);
            });
    });

    return event => {
        const { settings, open, options, selected } = store.getState();
        const value = event.target.value;
        //single mode: editing the input away from the shown selection clears it
        //(and the hidden value field, so a stale value isn't submitted)
        if (!settings.multiple && selected && settings.template(selected) !== value) store.update({ ...store.getState(), selected: null }, [ clearStatus, syncHiddenValue ]);
        //free-text single mode: with nothing selected, keep submitting what's typed
        else if (!settings.multiple && settings.allowFreeText && !selected) syncHiddenValue(store.getState());
        if (value.length < settings.minlength) {
            if (open) store.update({ ...store.getState(), open: false }, [ hideList ]);
            //empty the list and re-announce so a too-short query says "type more"
            //(not "no results"), including when typing up from an empty field
            store.update({ ...store.getState(), options: [] }, [ emptyList, renderStatus ]);
            return;
        }
        if (settings.async) return runAsyncSearch(value);
        const results = settings.search(value);
        //same result set already rendered — just make sure the list is open (this
        //also reopens onto the no-results message when the set stays empty)
        if (areEqual(options, results)) {
            if (!open) store.update({ ...store.getState(), open: true }, [ renderList, renderStatus ]);
            return;
        }
        //open regardless of count: empty results render the no-results message
        store.update({ ...store.getState(), options: results, open: true }, [ renderList, renderStatus ]);
    };
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
    broadcast(store, 'clear');
};

export const chipRemove = store => event => {
    const button = event.target.closest('.autocomplete__chip-remove');
    //ignore clicks anywhere on the output that aren't a remove button
    if (!button) return;
    const state = store.getState();
    const value = button.dataset.value;
    const removed = state.selected.find(item => String(state.settings.extractValue(item)) === value);
    store.update({ ...state, selected: state.selected.filter(item => String(state.settings.extractValue(item)) !== value) }, [ syncOutput, focusInput ]);
    broadcast(store, 'remove', removed);
};
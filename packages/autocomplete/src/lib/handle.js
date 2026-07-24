import { emptyList, renderList, renderStatus, clearStatus, showList, hideList, showLoading, setValue, clearInput, focusInput, syncOutput, syncHiddenValue, broadcast } from './dom.js';
import { areEqual, capResults, debounce, isPrintableKeyCode } from './utils.js';
import { KEYCODES } from './constants.js';

//resolve the option an event fired from via its aria-posinset. closest() finds
//the option element even when a click lands on a child node of a custom
//optionTemplate; returns undefined off the list background or the no-results item
const optionAt = (options, target) => {
    const option = target.closest('[role="option"]');
    return option && options[Number(option.getAttribute('aria-posinset')) - 1];
};

//multiple: append the option. Already-selected options are hidden from the list
//(see withoutSelected) so they can't be picked twice.
const addSelection = ({ selected, settings }, option) => {
    const value = settings.submissionTemplate(option);
    return selected.some(item => settings.submissionTemplate(item) === value)
        ? selected
        : [ ...selected, option ];
};

//multiple: drop options already chosen so they don't reappear in the list and
//can't be selected again. A no-op in single mode, which shows every result.
const withoutSelected = ({ settings, selected }, options) => {
    if (!settings.multiple) return options;
    const chosen = new Set(selected.map(item => String(settings.submissionTemplate(item))));
    return options.filter(option => !chosen.has(String(settings.submissionTemplate(option))));
};

//submitOnConfirm: submit the enclosing form. requestSubmit fires the submit event
//and runs native validation (Safari 16+); fall back to submit() on older browsers,
//which submits without either. A no-op when the component isn't inside a form.
const submitForm = input => {
    const form = input.form;
    if (form) (form.requestSubmit ? form.requestSubmit() : form.submit());
};

/*
 * Commit a selection and close the list. Single mode replaces the selection and
 * writes it to the input; multiple mode toggles it into the chip list and clears
 * the search input. In both modes a refocus commit (keyboard select or click,
 * but not a Tab/blur commit) returns focus to the input — otherwise a keyboard
 * select leaves focus on the option element that emptyList then removes, dropping
 * focus to document.body.
 */
const commitSelection = (store, option, refocus = false) => {
    if (!option) return;
    const state = store.getState();
    if (state.settings.multiple) {
        //clear the results so retyping the same query re-renders the (now emptied) list
        const effects = [ clearInput, syncOutput, hideList, emptyList, clearStatus ];
        if (refocus) effects.push(focusInput);
        store.update({ ...state, selected: addSelection(state, option), options: [], open: false }, effects);
    } else {
        const effects = [ setValue, hideList, emptyList, renderStatus ];
        if (refocus) effects.push(focusInput);
        store.update({ ...state, selected: option, open: false }, effects);
    }
    broadcast(store, 'confirm', option);
    //an active confirmation (click / Space / Enter, i.e. refocus) submits the form
    //when submitOnConfirm is set; a passive Tab/blur commit (refocus false) does not,
    //so tabbing past the field never navigates
    if (refocus && state.settings.submitOnConfirm) submitForm(state.dom.input);
};

// ignore async requests whose query no longer matches current user input 
// - ensures latest keystroke wins if user types after a request already fired
const resolveAsyncResults = (store, value, results) => {
    const state = store.getState();
    if (state.dom.input.value !== value) return;
    store.update({ ...state, options: capResults(withoutSelected(state, results), state.settings.maxResults), open: true }, [ renderList, renderStatus ]);
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
    if (settings.confirmOnBlur) commitSelection(store, optionAt(options, event.target));
};

const handleEnter = (store, event) => {
    const { open, dom, options, settings } = store.getState();
    const option = optionAt(options, event.target);
    //submitOnConfirm (search-style): a highlighted option is committed — which submits
    //the form itself (see commitSelection), matching a click or Space — and with nothing
    //highlighted the raw typed query is submitted, like a plain search box.
    if (settings.submitOnConfirm) {
        event.preventDefault();
        if (option) commitSelection(store, option, true);
        else submitForm(dom.input);
        return;
    }
    //no selectable options (e.g. the list is showing the no-results message) —
    //leave Enter alone so a normal form submit isn't swallowed
    if (options.length === 0) return;
    if (!open && event.target.parentElement !== dom.list) return;
    event.preventDefault();
    commitSelection(store, option, true);
};

const handleSpace = (store, event) => {
    const { open, dom, settings, options } = store.getState();
    //if event is fired from input, and the list is closed and there's no query, open it
    //if settings.list is empty then the options are being loaded dynamically, so do nothing
    if (event.target === dom.input && !open && !!settings.list && dom.input.value === '') {
        event.preventDefault();
        const state = store.getState();
        store.update({ ...state, options: withoutSelected(state, settings.list), open: true }, [ renderList, clearStatus ]);
        return;
    }
    //if event is fired from an option, select it
    if (event.target.parentElement === dom.list) {
        event.preventDefault();
        commitSelection(store, optionAt(options, event.target), true);
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
    if (!settings.multiple && selected && settings.displayTemplate(selected) === event.target.value) return event.target.select();
    if (!open) store.update({ ...store.getState(), open: true }, [ showList ]);
};

export const inputBlur = store => event => {
    const { dom, open, settings  } = store.getState();
    if (dom.list.contains(document.activeElement) || dom.list.contains(event.relatedTarget)) return;
    if (open) {
        if (settings.clearOnBlur) dom.input.value = '';
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
        if (!settings.multiple && selected && settings.displayTemplate(selected) !== value) store.update({ ...store.getState(), selected: null }, [ clearStatus, syncHiddenValue ]);
        //free-text single mode: with nothing selected, keep submitting what's typed
        else if (!settings.multiple && settings.allowFreeText && !selected) syncHiddenValue(store.getState());
        if (value.length < settings.minlength) {
            if (open) store.update({ ...store.getState(), open: false }, [ hideList ]);
            store.update({ ...store.getState(), options: [] }, [ emptyList, renderStatus ]);
            return;
        }
        if (settings.async) return runAsyncSearch(value);
        const results = capResults(withoutSelected(store.getState(), settings.search(value)), settings.maxResults);
        if (areEqual(options, results)) {
            if (!open) store.update({ ...store.getState(), open: true }, [ renderList, renderStatus ]);
            return;
        }
        store.update({ ...store.getState(), options: results, open: true }, [ renderList, renderStatus ]);
    };
};

export const optionClick = store => event => {
    const { options } = store.getState();
    commitSelection(store, optionAt(options, event.target), true);
};

export const optionBlur = store => event => {
    const { dom, open, settings, options } = store.getState();
    if (dom.node.contains(event.relatedTarget)) return;
    if (!open) return;
    if (settings.confirmOnBlur) commitSelection(store, optionAt(options, event.target));
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
    const removed = state.selected.find(item => String(state.settings.submissionTemplate(item)) === value);
    store.update({ ...state, selected: state.selected.filter(item => String(state.settings.submissionTemplate(item)) !== value) }, [ syncOutput, focusInput ]);
    broadcast(store, 'remove', removed);
};
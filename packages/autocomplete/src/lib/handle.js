import { emptyList, renderList, renderStatus, renderActive, clearStatus, showList, hideList, showLoading, setValue, clearInput, focusInput, syncOutput, syncHiddenValue, broadcast } from './dom.js';
import { areEqual, capResults, debounce } from './utils.js';
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
 * the search input. Focus stays in the input throughout (activedescendant model),
 * so refocus is only a safety net for the click path — a mousedown that slipped
 * through preventDefault — keeping the tested "focus back on the input" guarantee.
 */
const commitSelection = (store, option, refocus = false) => {
    if (!option) return;
    const state = store.getState();
    if (state.settings.multiple) {
        //clear the results so retyping the same query re-renders the (now emptied) list
        const effects = [ clearInput, syncOutput, hideList, emptyList, clearStatus ];
        if (refocus) effects.push(focusInput);
        store.update({ ...state, selected: addSelection(state, option), options: [], open: false, active: -1 }, effects);
    } else {
        //clear the results and the live region: the list is closing, so a stale
        //"N results available" must not linger (matches the multiple-mode branch)
        const effects = [ setValue, hideList, emptyList, clearStatus ];
        if (refocus) effects.push(focusInput);
        store.update({ ...state, selected: option, options: [], open: false, active: -1 }, effects);
    }
    broadcast(store, 'confirm', option);
    //an active confirmation (click / Enter, i.e. refocus) submits the form
    //when submitOnConfirm is set; a passive Tab/blur commit (refocus false) does not,
    //so tabbing past the field never navigates
    if (refocus && state.settings.submitOnConfirm) submitForm(state.dom.input);
};

// ignore async requests whose query no longer matches current user input 
// - ensures latest keystroke wins if user types after a request already fired
const resolveAsyncResults = (store, value, results) => {
    const state = store.getState();
    if (state.dom.input.value !== value) return;
    store.update({ ...state, options: capResults(withoutSelected(state, results), state.settings.maxResults), open: true, active: -1 }, [ renderList, renderStatus ]);
};

export const keydown = store => event => {
    switch (KEYCODES[event.keyCode]) {
    case 'up':
        handleUpArrow(store, event);
        break;
    case 'down':
        handleDownArrow(store, event);
        break;
    case 'enter':
        handleEnter(store, event);
        break;
    case 'escape':
        handleEscape(store);
        break;
    case 'tab':
        handleBlur(store);
        break;
    case 'backspace':
        handleBackspace(store, event);
        break;
    }
};

//multiple: Backspace on an empty input removes the last chip. Otherwise it's an
//ordinary edit in the input (focus never leaves it in the activedescendant model).
const handleBackspace = (store, event) => {
    const { dom, settings, selected } = store.getState();
    if (settings.multiple && event.target === dom.input && dom.input.value === '' && selected.length) {
        const removed = selected[selected.length - 1];
        store.update({ ...store.getState(), selected: selected.slice(0, -1) }, [ syncOutput ]);
        broadcast(store, 'remove', removed);
    }
};

const handleBlur = store => {
    const { open, settings, options, active } = store.getState();
    //Tab out: commit the highlighted option (confirmOnBlur) before focus leaves.
    //Nothing highlighted, or the list already closed, means nothing to commit — the
    //blur event handler (inputBlur) closes the list either way.
    if (!open || active < 0) return;
    if (settings.confirmOnBlur) commitSelection(store, options[active]);
};

const handleEnter = (store, event) => {
    const { dom, options, settings, active } = store.getState();
    //the highlighted option, if any — focus stays in the input, so the active index
    //(not document focus) says what Enter commits
    const option = active >= 0 ? options[active] : null;
    //submitOnConfirm (search-style): a highlighted option is committed — which submits
    //the form itself (see commitSelection), matching a click — and with nothing
    //highlighted the raw typed query is submitted, like a plain search box.
    if (settings.submitOnConfirm) {
        event.preventDefault();
        if (option) commitSelection(store, option, true);
        else submitForm(dom.input);
        return;
    }
    //nothing highlighted (no results, or the caret is in the input with nothing
    //arrowed to) — leave Enter alone so a normal form submit isn't swallowed
    if (!option) return;
    event.preventDefault();
    commitSelection(store, option, true);
};

const handleEscape = store => {
    const state = store.getState();
    if (!state.open) return;
    //close and clear the highlight; focus is already in the input (it never left),
    //and renderActive drops aria-selected + the input's aria-activedescendant
    store.update({ ...state, open: false, active: -1 }, [ renderActive, hideList, clearStatus ]);
};

const handleUpArrow = (store, event) => {
    event.preventDefault();
    const state = store.getState();
    //at the top of the list (active 0) Up returns to the input (active -1); with the
    //caret already in the input, or the list closed, there's nowhere further up to go
    if (!state.open || state.active < 0) return;
    store.update({ ...state, active: state.active - 1 }, [ renderActive ]);
};

const handleDownArrow = (store, event) => {
    event.preventDefault();
    const state = store.getState();
    const { open, options, active } = state;
    //from the input (active -1) Down highlights the first option; stop at the last one
    if (!open || options.length === 0 || active >= options.length - 1) return;
    store.update({ ...state, active: active + 1 }, [ renderActive ]);
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
    const { dom, open, settings, options, active } = store.getState();
    //a mousedown on the list is prevented from stealing focus (optionMouseDown), so
    //a blur into the list is never a real exit — leave the click handler to commit
    if (dom.list.contains(document.activeElement) || dom.list.contains(event.relatedTarget)) return;
    if (!open) return;
    //confirmOnBlur: an arrowed-to option is committed as focus leaves the field (a
    //click elsewhere or programmatic blur; Tab is committed up-front by handleBlur,
    //which closes first so this sees open=false and skips). Focus never sat on the
    //option — the active index is what carries the highlight in this model.
    if (settings.confirmOnBlur && active >= 0) return commitSelection(store, options[active]);
    if (settings.clearOnBlur) dom.input.value = '';
    const dropSelection = settings.clearOnBlur && !settings.multiple;
    store.update(
        { ...store.getState(), open: false, active: -1, ...(settings.clearOnBlur ? { options: [] } : {}), ...(dropSelection ? { selected: null } : {}) },
        dropSelection ? [ renderList, clearStatus, syncHiddenValue ] : [ renderList, clearStatus ]
    );
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
            store.update({ ...store.getState(), options: [], active: -1 }, [ emptyList, renderStatus ]);
            return;
        }
        if (settings.async) return runAsyncSearch(value);
        const results = capResults(withoutSelected(store.getState(), settings.search(value)), settings.maxResults);
        if (areEqual(options, results)) {
            if (!open) store.update({ ...store.getState(), open: true, active: -1 }, [ renderList, renderStatus ]);
            return;
        }
        //typing narrows the list, so the previous highlight no longer applies
        store.update({ ...store.getState(), options: results, open: true, active: -1 }, [ renderList, renderStatus ]);
    };
};

export const optionClick = store => event => {
    const { options } = store.getState();
    commitSelection(store, optionAt(options, event.target), true);
};

export const optionMouseDown = event => {
    // Keep focus in the input when an option is clicked: preventing the mousedown
    // default stops the input blurring before the click lands. Without this the blur
    // (inputBlur) would close the list and the click would fall through to whatever
    // is underneath. Safari is the strict case — it fires focusout before click.
    // See: http://stackoverflow.com/questions/7621711/how-to-prevent-blur-running-when-clicking-a-link-in-jquery
    event.preventDefault();
};

export const clear = store => () => {
    const state = store.getState();
    if (state.settings.multiple) store.update({ ...state, selected: [], options: [], open: false, active: -1 }, [ clearInput, syncOutput, hideList, emptyList, clearStatus ]);
    else store.update({ ...state, selected: null, options: [], open: false, active: -1 }, [ setValue, hideList, emptyList, clearStatus ]);
    broadcast(store, 'clear');
};

/*
 * Restore the initial selection when the enclosing form is reset, so an enhanced
 * control returns to its default like a native <select> — rather than leaving stale
 * chips/values on screen while the browser blanks the generated fields. The reset
 * event fires *before* the browser resets the controls, so the restore is deferred to
 * a microtask that runs afterwards and reasserts the visible input / hidden field(s).
 */
export const resetForm = store => () => queueMicrotask(() => {
    const state = store.getState();
    const selected = state.settings.multiple ? [ ...state.selectedInitial ] : state.selectedInitial;
    const effects = state.settings.multiple
        ? [ clearInput, syncOutput, hideList, emptyList, clearStatus ]
        : [ setValue, hideList, emptyList, clearStatus ];
    store.update({ ...state, selected, options: [], open: false, active: -1 }, effects);
});

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
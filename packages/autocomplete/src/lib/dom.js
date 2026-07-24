import { resolveMsg } from './utils.js';
import { EVENTS } from './constants.js';

/*
 * Dispatch a selection event from the component node so consumers can react
 * without holding the instance reference.
 */
export const broadcast = (store, action, option = null) => {
    const state = store.getState();
    state.dom.node.dispatchEvent(new CustomEvent(EVENTS[action], {
        bubbles: true,
        detail: { action, option, selected: state.selected, getState: store.getState }
    }));
};

export const createInput = ({ node, settings, id, listId, describedby }) => {
    const input = document.createElement('input');
    input.setAttribute('id', id);
    node.removeAttribute('id');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-controls', listId);
    //link the minlength hint so it's announced on focus (see hint below)
    if (describedby) input.setAttribute('aria-describedby', describedby);
    if (settings.placeholder) input.setAttribute('placeholder', settings.placeholder);
    input.classList.add(settings.inputClassName);
    //the visible input is display/search only in every mode; the form value is
    //carried by a hidden field (single mode) or the chips' hidden inputs (multiple)
    node.appendChild(input);

    return input;
};

/*
 * Visually-hidden hint linked to the combobox via aria-describedby, so the
 * minlength requirement (hintMsg) is announced when the input gains focus —
 * before typing — rather than reactively from the live region. Only created
 * when minlength makes the requirement meaningful (see factory).
 */
export const createHint = ({ node, id, settings }) => {
    const hint = document.createElement('span');
    hint.setAttribute('id', id);
    hint.classList.add('autocomplete__hint');
    hint.textContent = resolveMsg(settings.hintMsg, settings.minlength);
    node.appendChild(hint);

    return hint;
};

export const createList = ({ node, id, labelledby }) => {
    const list = document.createElement('ul');
    list.setAttribute('role', 'listbox');
    list.setAttribute('hidden', 'hidden');
    list.setAttribute('id', id);
    list.setAttribute('aria-labelledby', labelledby);
    list.classList.add('autocomplete__list');
    node.appendChild(list);

    return list;
};

export const createStatus = node => {
    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.classList.add('autocomplete__status');
    node.appendChild(status);

    return status;
};

/*
 * The chip container (multiple mode). Created detached and only added to the DOM
 * once it has a chip to hold — see syncOutput — so an empty, invalid <ul> is never
 * rendered while the field awaits its first selection.
 */
export const createOutput = () => {
    const output = document.createElement('ul');
    output.classList.add('autocomplete__output');

    return output;
};

/*
 * Single-mode hidden field carrying the submit value under settings.name, so the
 * visible combobox can display the option label (displayTemplate) while the form
 * still receives the option value (submissionTemplate).
 */
export const createHiddenValue = ({ node, name }) => {
    const hidden = document.createElement('input');
    hidden.setAttribute('type', 'hidden');
    if (name) hidden.setAttribute('name', name);
    node.appendChild(hidden);

    return hidden;
};

export const setupListeners = state => {
    state.dom.input.addEventListener('input', state.handle.input.input);
    state.dom.input.addEventListener('focus', state.handle.input.focus);
    state.dom.input.addEventListener('blur', state.handle.input.blur);
    state.dom.list.addEventListener('click', state.handle.option.click);
    state.dom.node.addEventListener('keydown', state.handle.container.keydown);
    state.dom.list.addEventListener('mousedown', state.handle.option.mousedown);
    //chips (multiple mode only): remove buttons are delegated on the output list,
    //the handler ignores any click that isn't on a remove button
    if (state.dom.output) state.dom.output.addEventListener('click', state.handle.chip.remove);
    //restore the initial selection when the enclosing form is reset (see resetForm)
    if (state.dom.input.form) state.dom.input.form.addEventListener('reset', state.handle.form.reset);
};

export const emptyList = state => state.dom.list.replaceChildren();

export const renderOptions = state => state.options.map((option, index) => {
    const el = document.createElement('li');
    el.setAttribute('role', 'option');
    el.classList.add('autocomplete__option');
    el.tabIndex = -1;
    //optionTemplate (falling back to displayTemplate) renders the option's content:
    //a DOM node is appended as-is, and a string returned by optionTemplate is rich
    //HTML set via innerHTML - authored as a template literal, sanitising
    //untrusted values with the exported escapeHtml. The displayTemplate fallback is
    //always plain text, set safely as textContent.
    const content = (state.settings.optionTemplate || state.settings.displayTemplate)(option);
    if (content && content.nodeType) el.appendChild(content);
    else if (state.settings.optionTemplate) el.innerHTML = content;
    else el.textContent = content;
    el.setAttribute('aria-posinset', index + 1);
    el.setAttribute('aria-setsize', state.options.length);
    el.setAttribute('aria-selected', 'false');
    el.addEventListener('blur', state.handle.option.blur);

    return el;
});

/*
 * A single, non-selectable listbox item shown when a search returns nothing, so
 * an open list reads as "searched, found nothing" - the live status region announces 
 * the same message for assistive tech.
 */
export const renderNoResults = state => {
    const el = document.createElement('li');
    el.setAttribute('role', 'option');
    el.setAttribute('aria-disabled', 'true');
    el.classList.add('autocomplete__option', 'autocomplete__option--empty');
    el.textContent = state.settings.noResultsMsg;

    return el;
};

export const renderList = state => {
    const { open, options, dom } = state;
    dom.list.replaceChildren(...(options.length > 0 ? renderOptions(state) : [ renderNoResults(state) ]));
    if (open) showList(state);
    else hideList(state);
};

export const hideList = state => {
    state.dom.list.setAttribute('hidden', 'hidden');
    state.dom.input.setAttribute('aria-expanded', 'false');
};

export const showList = state => {
    state.dom.list.removeAttribute('hidden');
    state.dom.input.setAttribute('aria-expanded', 'true');
};

export const renderStatus = state => {
    const { options, dom, settings } = state;
    const query = dom.input.value;
    if (query.length === 0 || query.length < Number(settings.minlength)) dom.status.textContent = '';
    else if (options.length === 0) dom.status.textContent = settings.noResultsMsg;
    else dom.status.textContent = `${options.length} ${options.length === 1 ? 'result is' : 'results are'} available`;
};

export const clearStatus = state => state.dom.status.textContent = '';

export const showLoading = state => state.dom.status.textContent = state.settings.loadingMsg;

/*
 * Keep the hidden field's form value in step with the current state: the
 * selection's submissionTemplate when something is selected, otherwise the raw typed
 * text if free text is allowed (else empty). A no-op in multiple mode and in
 * single mode with no name (where no hidden field exists).
 */
export const syncHiddenValue = state => {
    if (!state.dom.hidden) return;
    state.dom.hidden.value = state.selected
        ? state.settings.submissionTemplate(state.selected)
        : (state.settings.allowFreeText ? state.dom.input.value : '');
};

/*
 * Show the selection's display label in the visible input, and keep the hidden
 * value field (when present) in sync with the submit value — so the combobox
 * reads "Apple" while the form still submits "apple".
 */
export const setValue = state => {
    state.dom.input.value = state.selected ? state.settings.displayTemplate(state.selected) : '';
    syncHiddenValue(state);
};

export const clearInput = state => state.dom.input.value = '';

export const focusInput = state => state.dom.input.focus();

/*
 * Multiple mode: build a removable chip per selected option — display label,
 * a remove button (labelled for screen readers) and a hidden input carrying the
 * value under settings.name so each selection is submitted with the form.
 */
export const renderChips = state => state.selected.map(option => {
    const { displayTemplate, submissionTemplate, name } = state.settings;
    const chip = document.createElement('li');
    chip.classList.add('autocomplete__chip');

    const label = document.createElement('span');
    label.classList.add('autocomplete__chip-label');
    label.textContent = displayTemplate(option);
    chip.appendChild(label);

    const remove = document.createElement('button');
    remove.setAttribute('type', 'button');
    remove.classList.add('autocomplete__chip-remove');
    remove.setAttribute('aria-label', `Remove ${displayTemplate(option)}`);
    remove.dataset.value = submissionTemplate(option);
    chip.appendChild(remove);

    //no name means the component has no form value — chips are UI only
    if (name) {
        const hidden = document.createElement('input');
        hidden.setAttribute('type', 'hidden');
        hidden.setAttribute('name', name);
        hidden.value = submissionTemplate(option);
        chip.appendChild(hidden);
    }

    return chip;
});

/*
 * Reconcile the chips with the current selection. The output list stays out of the
 * DOM until there's at least one chip to show, and is removed again once the
 * selection empties — so the page never carries an empty output list.
 */
export const syncOutput = state => {
    const { output, node } = state.dom;
    if (state.selected.length === 0) return output.remove();
    output.replaceChildren(...renderChips(state));
    if (!output.parentNode) node.appendChild(output);
};

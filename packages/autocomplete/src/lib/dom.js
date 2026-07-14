// import { optionMouseDown } from './handle';

export const input = ({ node, settings, id, listId }) => {
    const input = document.createElement('input');
    input.setAttribute('id', id);
    node.removeAttribute('id');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-controls', listId);
    input.classList.add(settings.inputClassname);
    //the visible input is display/search only in every mode; the form value is
    //carried by a hidden field (single mode) or the chips' hidden inputs (multiple)
    node.appendChild(input);

    return input;
};

export const list = ({ node, id, labelledby }) => {
    const list = document.createElement('ul');
    list.setAttribute('role', 'listbox');
    list.setAttribute('hidden', 'hidden');
    list.setAttribute('id', id);
    list.setAttribute('aria-labelledby', labelledby);
    list.classList.add('autocomplete__list');
    node.appendChild(list);

    return list;
};

export const status = node => {
    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.classList.add('autocomplete__status');
    node.appendChild(status);

    return status;
};

export const output = ({ node }) => {
    const output = document.createElement('ul');
    output.classList.add('autocomplete__output');
    node.appendChild(output);

    return output;
};

/*
 * Single-mode hidden field carrying the submit value under settings.name, so the
 * visible combobox can display the option label (template) while the form still
 * receives the option value (extractValue).
 */
export const hiddenValue = ({ node, name }) => {
    const hidden = document.createElement('input');
    hidden.setAttribute('type', 'hidden');
    if (name) hidden.setAttribute('name', name);
    node.appendChild(hidden);

    return hidden;
};

export const listen = state => {
    state.dom.input.addEventListener('input', state.handle.input.input);
    state.dom.input.addEventListener('focus', state.handle.input.focus);
    state.dom.input.addEventListener('blur', state.handle.input.blur);
    state.dom.list.addEventListener('click', state.handle.option.click);
    state.dom.node.addEventListener('keydown', state.handle.container.keydown);
    state.dom.list.addEventListener('mousedown', state.handle.option.mousedown);
    // state.dom.list.addEventListener('blur', state.handle.option.blur);
    //chips (multiple mode only): remove buttons are delegated on the output list,
    //the handler ignores any click that isn't on a remove button
    if (state.dom.output) state.dom.output.addEventListener('click', state.handle.chip.remove);
};

export const emptyList = state => state.dom.list.replaceChildren();

export const renderOptions = state => state.options.map((option, index) => {
    const el = document.createElement('li');
    el.setAttribute('role', 'option');
    el.classList.add('autocomplete__option');
    el.tabIndex = -1;
    el.textContent = state.settings.template(option);
    el.setAttribute('aria-posinset', index + 1);
    el.setAttribute('aria-setsize', state.options.length);
    el.setAttribute('aria-selected', 'false');
    el.addEventListener('blur', state.handle.option.blur);

    return el;
});

export const renderList = state => {
    const { open, options, dom } = state;
    dom.list.replaceChildren(...renderOptions(state));
    if (open && options.length > 0) showList(state);
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
    const { options, dom } = state;
    if (options.length === 0) dom.status.textContent = state.settings.noResultsMsg;
    else dom.status.textContent = `${options.length} results are available`;
};

export const clearStatus = state => state.dom.status.textContent = '';

export const showLoading = state => state.dom.status.textContent = state.settings.loadingMsg;

/*
 * Keep the hidden field's form value in step with the current state: the
 * selection's extractValue when something is selected, otherwise the raw typed
 * text if free text is allowed (else empty). A no-op in multiple mode and in
 * single mode with no name (where no hidden field exists).
 */
export const syncHiddenValue = state => {
    if (!state.dom.hidden) return;
    state.dom.hidden.value = state.selected
        ? state.settings.extractValue(state.selected)
        : (state.settings.allowFreeText ? state.dom.input.value : '');
};

/*
 * Show the selection's display label in the visible input, and keep the hidden
 * value field (when present) in sync with the submit value — so the combobox
 * reads "Apple" while the form still submits "apple".
 */
export const setValue = state => {
    state.dom.input.value = state.selected ? state.settings.template(state.selected) : '';
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
    const { template, extractValue, name } = state.settings;
    const chip = document.createElement('li');
    chip.classList.add('autocomplete__chip');

    const label = document.createElement('span');
    label.classList.add('autocomplete__chip-label');
    label.textContent = template(option);
    chip.appendChild(label);

    const remove = document.createElement('button');
    remove.setAttribute('type', 'button');
    remove.classList.add('autocomplete__chip-remove');
    remove.setAttribute('aria-label', `Remove ${template(option)}`);
    remove.dataset.value = extractValue(option);
    chip.appendChild(remove);

    //no name means the component has no form value — chips are UI only
    if (name) {
        const hidden = document.createElement('input');
        hidden.setAttribute('type', 'hidden');
        hidden.setAttribute('name', name);
        hidden.value = extractValue(option);
        chip.appendChild(hidden);
    }

    return chip;
});

export const syncOutput = state => state.dom.output.replaceChildren(...renderChips(state));

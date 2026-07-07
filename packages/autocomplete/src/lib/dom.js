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
    //if not multiple, set name attribute on input
    if (!settings.multiple) input.setAttribute('name', settings.name);
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

// export const output = ({ node, settings }) => {
//     const output = document.createElement(settings.multiple ? 'ul' : 'div');
//     output.classList.add('autocomplete__output');
//     node.appendChild(output);

//     return output;
// };

export const listen = state => {
    state.dom.input.addEventListener('input', state.handle.input.input);
    state.dom.input.addEventListener('focus', state.handle.input.focus);
    state.dom.input.addEventListener('blur', state.handle.input.blur);
    state.dom.list.addEventListener('click', state.handle.option.click);
    state.dom.node.addEventListener('keydown', state.handle.container.keydown);
    state.dom.list.addEventListener('mousedown', state.handle.option.mousedown);
    // state.dom.list.addEventListener('blur', state.handle.option.blur);
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

export const setValue = state => state.dom.input.value = state.selected ? state.settings.extractValue(state.selected) : '';

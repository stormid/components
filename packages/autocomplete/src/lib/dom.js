// import { optionMouseDown } from './handle';

export const input = ({ node, settings }) => {
    const input = document.createElement('input');
    input.setAttribute('id', node.getAttribute('id') || settings.id);
    node.removeAttribute('id');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-controls', 'autocomplete-list');
    input.classList.add(settings.inputClassname);
    node.appendChild(input);
    
    return input;
};

export const list = (node, id) => {
    const list = document.createElement('ul');
    list.setAttribute('role', 'listbox');
    list.setAttribute('hidden', 'hidden');
    list.setAttribute('id', 'autocomplete-list');
    list.setAttribute('aria-labelledby', id);
    list.classList.add('autocomplete__list');
    node.appendChild(list);

    return list;
};

// export const option = ({ value, label }) => {
//     const option = document.createElement('li');
//     option.setAttribute('role', 'option');
//     option.classList.add('autocomplete__option');
//     option.tabIndex = -1;
//     // option.setAttribute('aria-posinset', index + 1);
//     // option.setAttribute('aria-setsize', options.length);
//     // option.textContent = templates(data);
// };

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

    return el;
});

export const renderList = state => {
    const { options, dom } = state;
    dom.list.replaceChildren(...renderOptions(state));
    if (options.length > 0) dom.list.removeAttribute('hidden');
    else dom.list.setAttribute('hidden', 'hidden');
};

export const hideList = state => state.dom.list.setAttribute('hidden', 'hidden');

export const showList = state => state.dom.list.removeAttribute('hidden');

export const renderStatus = state => {
    const { options, dom } = state;
    if (options.length === 0) dom.status.textContent = state.settings.noResultsMsg;
    else dom.status.textContent = `${options.length} results are available`;
};

export const clearStatus = state => state.dom.status.textContent = '';

export const setValue = state => state.dom.input.value = state.settings.extractValue(state.selected);

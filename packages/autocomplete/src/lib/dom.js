export const input = ({ node, settings }) => {
    const input = document.createElement('input');
    input.setAttribute('id', node.getAttribute('id') || settings.id);
    node.removeAttribute('id');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-controls', 'autocomplete-list');
    
    return input;
};

export const list = node => {
    const list = document.createElement('ul');
    list.setAttribute('role', 'listbox');
    list.setAttribute('hidden', 'hidden');
    list.setAttribute('id', 'autocomplete-list');
    list.classList.add('autocomplete__list');
    node.insertAdjacentElement('afterend', list);

    return list;
};

export const status = node => {
    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.classList.add('autocomplete__status');
    node.insertAdjacentElement('afterend', status);

    return status;
};

export const output = ({ node, settings }) => {
    const output = document.createElement(settings.multiple ? 'ul' : 'div');
    output.classList.add('autocomplete__output');
    node.insertAdjacentElement('afterend', output);

    return output;
};

export const listeners = store => {
    //input listener
    //list keyboard listener

};
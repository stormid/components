import { DOTNET_CLASSNAMES, TOKENS } from '../constants';

/**
 * Hypertext DOM factory function
 * 
 * @param nodeName [String]
 * @param attributes [Object]
 * @param text [String] The innerText of the new node
 * 
 * @returns node [DOM node]
 * 
 */
export const h = (nodeName, attributes, text) => {
    let node = document.createElement(nodeName);

    for (let prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }
    if (text !== undefined && text.length) node.appendChild(document.createTextNode(text));

    return node;
};

/**
 * Creates and appends a text node error message to a  error container DOM node for a group
 * 
 * @param group [Object, vaidation group] 
 * @param msg [String] The error message
 * 
 * @returns node [Text node]
 * 
 */
export const createErrorTextNode = (group, msg) => {

    let node = document.createTextNode(msg);
    group.serverErrorNode.classList.remove(DOTNET_CLASSNAMES.VALID);
    group.serverErrorNode.classList.add(DOTNET_CLASSNAMES.ERROR);
    
    return group.serverErrorNode.appendChild(node);
};

/**
 * Removes the error message, updates .NET MVC error span classNames and deletes the 
 * error from local errors tracking object
 * 
 * Signature () => groupName => state => {}
 * (groupName for ease of use as eventListener and in whole form iteration)
 * 
 * @param groupName [String, vaidation group] 
 * @param state [Object, validation state]
 * 
 */
export const clearError = groupName => state => {
    if (state.groups[groupName].serverErrorNode) {
        state.groups[groupName].serverErrorNode.innerHTML = '';
        state.groups[groupName].serverErrorNode.classList.remove(DOTNET_CLASSNAMES.ERROR);
        state.groups[groupName].serverErrorNode.classList.add(DOTNET_CLASSNAMES.VALID);
    } else {
        state.errors[groupName].parentNode.removeChild(state.errors[groupName]);
    }
    state.groups[groupName].fields.forEach(field => {
        field.parentNode.classList.remove('is--invalid');
        field.removeAttribute('aria-invalid');
        const describedbyid = ((state.groups[groupName].serverErrorNode || state.errors[groupName]).id);

        //check whether the aria-describedby matches the id, if not another id must be present, only replace the removed error id
        if (field.hasAttribute('aria-describedby')) {
            if (field.getAttribute('aria-describedby') === describedbyid) field.removeAttribute('aria-describedby');
            else field.setAttribute('aria-describedby', field.getAttribute('aria-describedby').replace(` ${describedbyid}`, ''));
        }
    });
    delete state.errors[groupName];//shouldn't be doing this here...
};

/**
 * Iterates over all errors in local scope to remove each error prior to re-validation
 * 
 * @param state [Object, validation state]
 * 
 */
export const clearErrors = state => {
    state.errors && Object.keys(state.errors).forEach(name => {
        clearError(name)(state);
    });
};

/**
 * Iterates over all groups to render each error post-vaidation
 * 
 * @param state [Object, validation state]
 * 
 */
export const renderErrors = state => {
    Object.keys(state.groups).forEach(groupName => {
        if (!state.groups[groupName].valid) renderError(groupName)(state);
    });
};


/**
 * Looks for any value tokens and replaces them within the error message
 * 
 * @param state [Object, validation state]
 * @param groupName [String, validation group] 
 * 
 */
export const updateMessageValues = (state, groupName) => {
    let msg = state.groups[groupName].errorMessages[0];

    let values = state.groups[groupName].fields.reduce((newMsg, field, index, array) => {
        if (index === array.length-1) return newMsg + field.value;
        return newMsg = field.value + ', ';
    }, '');

    return msg.replace(TOKENS.VALUE, values);
};


/**
 * Adds an error message to the DOM and saves it to local scope
 * 
 * If .NET MVC error span is present, it is used with a appended textNode,
 * if not a new DOM node is created
 * 
 * Signature () => groupName => state => {}
 * (groupName for ease of use as eventListener and in whole form iteration)
 * 
 * @param groupName [String, validation group] 
 * @param state [Object, validation state]
 * 
 */
export const renderError = groupName => state => {
    if (state.errors[groupName]) clearError(groupName)(state);

    let msg = updateMessageValues(state, groupName);

    //shouldn't be updating state here...
    //to do: refactor to update state as a side effect afterwards?
    //would need to pass Store instead of state
    if (state.groups[groupName].serverErrorNode) {
        state.errors[groupName] = createErrorTextNode(state.groups[groupName], msg);
    } else {
        //No server error node found, so attempt to render inside the label.  If no label found, log error to console.
        const label = document.querySelector(`[for="${state.groups[groupName].fields[state.groups[groupName].fields.length-1].getAttribute('id')}"]`);

        if (label !== null) {
            state.errors[groupName] = label.parentNode.insertBefore(h('span', { class: DOTNET_CLASSNAMES.ERROR, id: `${groupName}-error-message` }, msg), label.nextSibling);
        } else {
            console.error(`No matching HTML label or server error node found for validation group: ${groupName}. Error message: '${msg}' cannot be displayed. Form will not be submitted.`);
            return;
        }
    }

    const errorContainer = state.groups[groupName].serverErrorNode || state.errors[groupName];
						
    state.groups[groupName].fields.forEach(field => {
        field.parentNode.classList.add('is--invalid');
        field.setAttribute('aria-invalid', 'true');
        if (!field.hasAttribute('aria-describedby') || !hasAriaDescribedbyValue(field, errorContainer.getAttribute('id'))) {
            field.setAttribute('aria-describedby', (field.hasAttribute('aria-describedby')
                ? `${field.getAttribute('aria-describedby')} ${errorContainer.getAttribute('id')}`
                : errorContainer.getAttribute('id'))
            );
        }
    });
};


export const hasAriaDescribedbyValue = (field, value) => {
    const describedby = field.getAttribute('aria-describedby').split(' ');
    return describedby.length > 0
        && describedby.reduce((acc, curr) => (acc || curr === value), false);
};


/**
 * Set focus on first invalid field after form-level validate()
 * 
 * We can assume that there is a group in an invalid state,
 * and that the group has at least one field
 * 
 * @param groups [Object, validation group slice of state]
 * 
 */
export const focusFirstInvalidField = state => {
    const firstInvalid = Object.keys(state.groups).reduce((acc, curr) => {
        if (!acc && !state.groups[curr].valid) acc = state.groups[curr].fields[0];
        return acc;
    }, false);
    firstInvalid && firstInvalid.focus();
};

/**
 * Creates a hidden field duplicate of a given field, for conferring submit button values
 * 
 * @param source [Node] A submit input/button
 * @param form [Node] A form node
 * 
 */
export const createButtonValueNode = (source, form) => {
    const node = document.createElement('input');
    node.setAttribute('type', 'hidden');
    node.setAttribute('name', source.getAttribute('name'));
    node.setAttribute('value', source.getAttribute('value'));
    return form.appendChild(node);
};

/**
 * Removes the node added in createButtonValueNode
 * 
 * @param node [Node] A hidden input
 * 
 */
export const cleanupButtonValueNode = node => {
    node.parentNode.removeChild(node);
};

/**
 * Add aria-required attribute to fields if appropriate (has required/data-val-required, is not a checkbox or radio group) 
 * 
 * @param fields [Array of DOMElements]
 * 
 * @returns fields
 */
export const addAriaRequired = fields => {
    fields.forEach(field => {
        if (
            (field.hasAttribute('required') || field.hasAttribute('data-val-required'))
            && ((field.getAttribute('type') !== 'radio' && field.getAttribute('type') !== 'checkbox')
                || (field.getAttribute('type') === 'checkbox' && fields.length === 1))
        ) {
            field.setAttribute('aria-required', 'true');
        }
    });

    return fields;
};

/**
 * Adds attributes to input and error nodes to help accessibility
 * 
 * @param state [Object]
 */
export const addAXAttributes = state => {
    Object.keys(state.groups).forEach(groupName => {
        //ensure error message has an id for aria-describedby
        if (state.groups[groupName].serverErrorNode && !state.groups[groupName].serverErrorNode.hasAttribute('id')) state.groups[groupName].serverErrorNode.setAttribute('id', `${groupName}-error-message`);

        //Add aria-required to inputs that are not radios, nor checkbox groups (single checkbox gets the attribute added)
        addAriaRequired(state.groups[groupName].fields);
    });
};
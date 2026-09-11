import { DOTNET_CLASSNAMES, TOKENS } from '../constants/index.js';

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
 * The id of the client-rendered error span for a group. It keys off the group's last field id
 * (which is unique in a valid document) rather than the group name: two validate() instances on
 * one page that share a group name - e.g. a sign-in and a register form both with an `email`
 * field - would otherwise mint duplicate ids, and a document-wide lookup would find and remove
 * (or describe) the first instance's node instead of the caller's own.
 *
 * @param group [Object, validation group]
 * @returns String|null, the error span id, or null when the last field has no id to key off
 */
export const clientErrorId = group => {
    const lastField = group.fields[group.fields.length - 1];
    const id = lastField && lastField.getAttribute('id');
    return id ? `${id}-error-message` : null;
};

/**
 * Removes a group's rendered error message and its invalidity attributes (a pure DOM effect).
 * The `errors` state slice is maintained by the reducers, not here.
 *
 * Idempotent: a no-op when the group has no error currently rendered, so it is safe to call
 * across every group (see clearErrors) or before a re-render (see renderError).
 *
 * Signature () => groupName => state => {}
 * (groupName for ease of use as eventListener and in whole form iteration)
 *
 * @param groupName [String, vaidation group]
 * @param state [Object, validation state]
 *
 */
export const clearError = groupName => state => {
    const { serverErrorNode } = state.groups[groupName];
    if (serverErrorNode) {
        serverErrorNode.innerHTML = '';
        serverErrorNode.classList.remove(DOTNET_CLASSNAMES.ERROR);
        serverErrorNode.classList.add(DOTNET_CLASSNAMES.VALID);
    } else {
        //the client-side span carries an id unique to this instance, so it can be found and
        //removed without holding a node reference in state
        const errorId = clientErrorId(state.groups[groupName]);
        const errorNode = errorId && document.getElementById(errorId);
        if (errorNode) errorNode.parentNode.removeChild(errorNode);
    }

    const describedbyid = serverErrorNode ? serverErrorNode.id : clientErrorId(state.groups[groupName]);

    state.groups[groupName].fields.forEach(field => {
        field.parentNode.classList.remove('is--invalid');
        field.removeAttribute('aria-invalid');

        //remove only this error's id from aria-describedby, preserving any others.
        //Token-based so it works whether the id is first, last, only, or amongst others.
        if (field.hasAttribute('aria-describedby')) {
            const remaining = field.getAttribute('aria-describedby')
                .split(/\s+/)
                .filter(id => id && id !== describedbyid);
            if (remaining.length) field.setAttribute('aria-describedby', remaining.join(' '));
            else field.removeAttribute('aria-describedby');
        }
    });
};

/**
 * Clears the rendered error for every group prior to re-validation (a pure DOM effect).
 * Iterates groups rather than the errors map so it does not depend on that map's contents.
 *
 * @param state [Object, validation state]
 *
 */
export const clearErrors = state => {
    Object.keys(state.groups).forEach(name => {
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
    const msg = state.groups[groupName].errorMessages[0];
    const values = state.groups[groupName].fields.map(field => field.value).join(', ');
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
    //clear any error currently rendered for this group first (idempotent) so a re-render can't duplicate it
    clearError(groupName)(state);

    const msg = updateMessageValues(state, groupName);
    const { serverErrorNode } = state.groups[groupName];
    let errorNode;

    if (serverErrorNode) {
        createErrorTextNode(state.groups[groupName], msg);
    } else {
        //No server error node found, so attempt to render inside the label.  If no label found, log error to console.
        const label = document.querySelector(`[for="${state.groups[groupName].fields[state.groups[groupName].fields.length-1].getAttribute('id')}"]`);

        if (label === null) {
            console.error(`No matching HTML label or server error node found for validation group: ${groupName}. Error message: '${msg}' cannot be displayed. Form will not be submitted.`);
            return;
        }
        //role="alert" so the message is announced when inserted (e.g. during real-time validation, where focus doesn't move)
        errorNode = label.parentNode.insertBefore(h('span', { class: DOTNET_CLASSNAMES.ERROR, id: clientErrorId(state.groups[groupName]), role: 'alert' }, msg), label.nextSibling);
    }

    const errorContainer = serverErrorNode || errorNode;

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
        const serverErrorNode = state.groups[groupName].serverErrorNode;
        if (serverErrorNode) {
            //ensure error message has an id for aria-describedby
            if (!serverErrorNode.hasAttribute('id')) serverErrorNode.setAttribute('id', `${groupName}-error-message`);
            //make the (initially empty) server-rendered container a live region so errors
            //inserted during real-time validation are announced, not only on submit.
            //Respect an author-provided role/aria-live if one is already present.
            if (!serverErrorNode.hasAttribute('aria-live') && !serverErrorNode.hasAttribute('role')) serverErrorNode.setAttribute('aria-live', 'polite');
        }

        //Add aria-required to inputs that are not radios, nor checkbox groups (single checkbox gets the attribute added)
        addAriaRequired(state.groups[groupName].fields);
    });
};
import { DOTNET_CLASSNAMES, TOKENS, SUBMITTER_OVERRIDES } from '../constants/index.js';

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
 * The element a group's error message is written into: its server error node, or else the client-rendered
 * span (which carries an id unique to this instance, so it can be found without holding a reference in state)
 *
 * @param group [Object, validation group]
 * @returns Node|null|false
 */
const findErrorContainer = group => {
    if (group.serverErrorNode) return group.serverErrorNode;
    const errorId = clientErrorId(group);
    return errorId && document.getElementById(errorId);
};

/**
 * The label a client-rendered error span is inserted after
 *
 * @param group [Object, validation group]
 * @returns Node|null
 */
const findLabel = group => document.querySelector(`[for="${group.fields[group.fields.length-1].getAttribute('id')}"]`);

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
        const errorNode = findErrorContainer(state.groups[groupName]);
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
 * Iterates over all groups post-validation, rendering each error and clearing any valid group's error
 * 
 * @param state [Object, validation state]
 * 
 */
export const renderErrors = state => {
    Object.keys(state.groups).forEach(groupName => {
        //groups that are now valid are cleared here rather than before validating, so an error that is
        //unchanged on re-submission is left in place rather than removed and re-rendered
        if (state.groups[groupName].valid) clearError(groupName)(state);
        else renderError(groupName)(state);
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
    const msg = updateMessageValues(state, groupName);
    const { serverErrorNode } = state.groups[groupName];
    let errorContainer = findErrorContainer(state.groups[groupName]);

    //Only rewrite the message when it has changed: real-time validation runs on every keystroke, and replacing
    //identical text each time is needless DOM churn (and re-announces it if an author has made the container live)
    if (!errorContainer || !errorContainer.classList.contains(DOTNET_CLASSNAMES.ERROR) || errorContainer.textContent !== msg) {
        //clear any error currently rendered for this group first (idempotent) so a re-render can't duplicate it
        clearError(groupName)(state);

        if (serverErrorNode) {
            createErrorTextNode(state.groups[groupName], msg);
        } else {
            //No server error node found, so attempt to render inside the label.  If no label found, log error to console.
            const label = findLabel(state.groups[groupName]);

            if (label === null) {
                console.error(`No matching HTML label or server error node found for validation group: ${groupName}. Error message: '${msg}' cannot be displayed. Form will not be submitted.`);
                return;
            }
            errorContainer = label.parentNode.insertBefore(h('span', { class: DOTNET_CLASSNAMES.ERROR, id: clientErrorId(state.groups[groupName]) }, msg), label.nextSibling);
        }
    }

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
 * Creates a hidden field, for conferring a submit button's value
 *
 * @param form [Node] A form node
 * @param name [String]
 * @param value [String]
 *
 */
export const createButtonValueNode = (form, name, value) => {
    const node = document.createElement('input');
    node.setAttribute('type', 'hidden');
    node.setAttribute('name', name);
    node.setAttribute('value', value);
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
 * Returns the name/value pairs a submit button adds to its form's data when it submits the form.
 * A named button with no value attribute submits an empty value; an unnamed one submits nothing.
 * An image button submits click coordinates instead of its value: they are not known here, so they
 * are 0,0 as for a keyboard activation
 *
 * @param submitter [Node] A submit button
 *
 * @returns [Array] of [name, value] pairs
 *
 */
export const getSubmitterEntries = submitter => {
    if (submitter.type === 'image') {
        const prefix = submitter.name ? `${submitter.name}.` : '';
        return [ [ `${prefix}x`, '0' ], [ `${prefix}y`, '0' ] ];
    }
    return submitter.name ? [ [ submitter.name, submitter.value ] ] : [];
};

/**
 * Mirrors a submit button onto its form, so that a programmatic submission sends what a native
 * submission by that button would: its formaction/formmethod/formenctype/formtarget override the
 * form's attributes, and its name/value is added as hidden fields
 *
 * @param form [Node] A form node
 * @param submitter [Node] The submit button that submitted the form
 *
 * @returns [Function] Restores the form to its previous state
 *
 */
export const applySubmitter = (form, submitter) => {
    const restorers = Object.keys(SUBMITTER_OVERRIDES)
        .filter(attribute => submitter.hasAttribute(attribute))
        .map(attribute => {
            const formAttribute = SUBMITTER_OVERRIDES[attribute];
            //null when absent, so restoring removes the attribute rather than setting it to ""
            const original = form.getAttribute(formAttribute);
            form.setAttribute(formAttribute, submitter.getAttribute(attribute));
            return () => {
                if (original === null) form.removeAttribute(formAttribute);
                else form.setAttribute(formAttribute, original);
            };
        });
    const buttonValueNodes = getSubmitterEntries(submitter).map(([ name, value ]) => createButtonValueNode(form, name, value));

    return () => {
        restorers.forEach(restore => restore());
        buttonValueNodes.forEach(cleanupButtonValueNode);
    };
};

/**
 * Add aria-required attribute to fields if appropriate (has data-val-required, is not a checkbox or radio group) 
 * 
 * @param fields [Array of DOMElements]
 * 
 * @returns fields
 */
export const addAriaRequired = fields => {
    fields.forEach(field => {
        if (
            field.hasAttribute('data-val-required')
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
        }

        //Add aria-required to inputs that are not radios, nor checkbox groups (single checkbox gets the attribute added)
        addAriaRequired(state.groups[groupName].fields);
    });
};

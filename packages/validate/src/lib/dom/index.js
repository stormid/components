import { DOTNET_CLASSNAMES } from '../constants';

//Track error message DOM nodes in local scope
let errorNodes = {};

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

    for(let prop in attributes) {
        node.setAttribute(prop, attributes[prop]);
    }
    if(text !== undefined && text.length) node.appendChild(document.createTextNode(text));

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
 * Removes the error message DOM node, updates .NET MVC error span classNames and deletes the 
 * error from local errorNodes tracking object
 * 
 * Signature () => groupName => state => {}
 * (Curried groupName for ease of use as eventListener and in whole form iteration)
 * 
 * @param groupName [String, vaidation group] 
 * @param state [Object, validation state]
 * 
 */
export const clearError = groupName => state => {
    errorNodes[groupName].parentNode.removeChild(errorNodes[groupName]);
    if(state.groups[groupName].serverErrorNode) {
        state.groups[groupName].serverErrorNode.classList.remove(DOTNET_CLASSNAMES.ERROR);
        state.groups[groupName].serverErrorNode.classList.add(DOTNET_CLASSNAMES.VALID);
    }
    state.groups[groupName].fields.forEach(field => { field.removeAttribute('aria-invalid'); });
    delete errorNodes[groupName];
};

/**
 * Iterates over all errorNodes in local scope to remove each error prior to re-validation
 * 
 * @param state [Object, validation state]
 * 
 */
export const clearErrors = state => {
    Object.keys(errorNodes).forEach(name => {
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
        if(!state.groups[groupName].valid) renderError(groupName)(state);
    })
};

/**
 * Adds an error message to the DOM and saves it to local scope
 * 
 * If .NET MVC error span is present, it is used with a appended textNode,
 * if not a new DOM node is created
 * 
 * Signature () => groupName => state => {}
 * (Curried groupName for ease of use as eventListener and in whole form iteration)
 * 
 * @param groupName [String, validation group] 
 * @param state [Object, validation state]
 * 
 */
export const renderError = groupName => state => {
    if(errorNodes[groupName]) clearError(groupName)(state);
    
    errorNodes[groupName] = 
        state.groups[groupName].serverErrorNode 
                ? createErrorTextNode(state.groups[groupName], state.groups[groupName].errorMessages[0]) 
                : state.groups[groupName]
                            .fields[state.groups[groupName].fields.length-1]
                            .parentNode
                            .appendChild(h('div', { class: DOTNET_CLASSNAMES.ERROR }, state.groups[groupName].errorMessages[0]));
						
	state.groups[groupName].fields.forEach(field => { 
        field.setAttribute('aria-invalid', 'true');
    });
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
export const focusFirstInvalidField = groups => {
    groups[Object.keys(groups)
        .filter(group => !group.valid)[0]]
        .fields[0]
        .focus();
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
}
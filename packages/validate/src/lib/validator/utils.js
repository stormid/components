export const isCheckable = field => (/radio|checkbox/i).test(field.type);

export const isFile = field => field.getAttribute('type') === 'file';

export const isHidden = field => field.getAttribute('type') === 'hidden';

export const isSelect = field => field.nodeName.toLowerCase() === 'select';

export const isSubmitButton = node =>  node.getAttribute('type') === 'submit' || node.nodeName === 'BUTTON';

export const hasNameValue = node => node.hasAttribute('name') && node.hasAttribute('value');

export const hasFormactionValue = node => node.hasAttribute('formaction') && node.getAttribute('formaction') !== '';

export const isRequired = group => group.validators.filter(validator => validator.type === 'required').length > 0;

export const groupIsAllHidden = fields => fields.reduce((acc, field) => {
    if (field.type !== 'hidden') acc = false;
    return acc;
}, true);

export const groupIsDisabled = fields => fields.reduce((acc, field) => {
    if (field.hasAttribute('disabled') && field.getAttribute('disabled') !== "false") acc = true;
    return acc;
}, false);

export const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

export const groupValueReducer = (acc, input) => {
    if (!isCheckable(input) && !isHidden(input) && hasValue(input)) acc = input.value.trim();
    if (isCheckable(input) && input.checked) {
        if (Array.isArray(acc)) acc.push(input.value.trim());
        else acc = [input.value.trim()];
    }
    return acc;
};

export const resolveGetParams = nodeArrays => nodeArrays.map(nodes => `${encodeURIComponent(nodes[0].getAttribute('name'))}=${encodeURIComponent(extractValueFromGroup(nodes))}`).join('&');

export const domNodesFromCommaList = list => list.split(',')
    .map(item => Array.from(document.querySelectorAll(`[name=${escapeAttributeValue(item)}]`)));

export const escapeAttributeValue = value => value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');

export const extractValueFromGroup = group => Object.prototype.hasOwnProperty.call(group, 'fields')
    ? group.fields.reduce(groupValueReducer, '')
    : group.reduce(groupValueReducer, '');


const abortError = () => {
    const error = new Error('Aborted');
    error.name = 'AbortError';
    return error;
};

/* node:coverage ignore next */
export const fetch = (url, props) =>
    new Promise((resolve, reject) => {
        //an already-aborted signal means the instance/group was torn down before the request started
        if (props.signal && props.signal.aborted) return reject(abortError());
        let xhr = new XMLHttpRequest();
        xhr.open(props.method || 'GET', url);
        if (props.headers) {
            Object.keys(props.headers).forEach(key => {
                xhr.setRequestHeader(key, props.headers[key]);
            });
        }
        //abort the in-flight request when the group's controller fires (destroy/removeGroup)
        if (props.signal) props.signal.addEventListener('abort', () => xhr.abort(), { once: true });
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
            else reject(xhr.statusText);
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.onabort = () => reject(abortError());
        xhr.send(props.body);
    });

export const findErrors = groups => Object.keys(groups).reduce((errors, groupName) => {
    if (groups[groupName].serverErrorNode){
        const serverErrorText = groups[groupName].serverErrorNode.textContent;
        if (serverErrorText) {
            errors[groupName] = serverErrorText;
        }
    }
    return errors;
}, {});


/*
 * Converts a passed selector which can be of varying types into an array of DOM Objects
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList, an HTMLCollection or a single DOM element.
 */
export const getSelection = selector => {
    if (typeof selector === 'string') return Array.from(document.querySelectorAll(selector));
    if (Array.isArray(selector)) return selector;
    if (selector instanceof NodeList || selector instanceof HTMLCollection) return Array.from(selector);
    if (selector && selector.nodeType === 1) return [selector]; // nodeType check is cross-realm safe, unlike instanceof HTMLElement
    return [];
};
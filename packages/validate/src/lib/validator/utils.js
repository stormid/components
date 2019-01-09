export const isCheckable = field => (/radio|checkbox/i).test(field.type);

export const isFile = field => field.getAttribute('type') === 'file';

export const isSelect = field => field.nodeName.toLowerCase() === 'select';

export const isSubmitButton = node =>  node.getAttribute('type') === 'submit' || node.nodeName === 'BUTTON';

export const hasNameValue = node => node.hasAttribute('name') && node.hasAttribute('value');

export const isRequired = group => group.validators.filter(validator => validator.type === 'required').length > 0;

const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

export const groupValueReducer = (acc, input) => {
    if(!isCheckable(input) && hasValue(input)) acc = input.value;
    if(isCheckable(input) && input.checked) {
        if(Array.isArray(acc)) acc.push(input.value)
        else acc = [input.value];
    }
    return acc;
};

export const resolveGetParams = nodeArrays => nodeArrays.map((nodes) => {
    return `${nodes[0].getAttribute('name')}=${extractValueFromGroup(nodes)}`;
}).join('&');

export const DOMNodesFromCommaList = (list, input) => list.split(',')
                                                .map(item => {
                                                    let resolvedSelector = escapeAttributeValue(appendStatePrefix(item, getStatePrefix(input.getAttribute('name'))));
                                                    return [].slice.call(document.querySelectorAll(`[name=${resolvedSelector}]`));
                                                });

const escapeAttributeValue = value => value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");

const getStatePrefix = fieldName => fieldName.substr(0, fieldName.lastIndexOf('.') + 1);

const appendStatePrefix = (value, prefix) => {
    if (value.indexOf("*.") === 0) value = value.replace("*.", prefix);
    return value;
}

export const pipe = (...fns) => fns.reduce((acc, fn) => fn(acc));


export const extractValueFromGroup = group => group.hasOwnProperty('fields') 
                                            ? group.fields.reduce(groupValueReducer, '')
                                            : group.reduce(groupValueReducer, '');

export const fetch = (url, props) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(props.method || 'GET', url);
        if (props.headers) {
            Object.keys(props.headers).forEach(key => {
                xhr.setRequestHeader(key, props.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
            else reject(xhr.statusText);
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(props.body);
    });
};
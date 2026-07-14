/*
 * Converts a passed selector which can be of varying types into an array of DOM Objects
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 */
export const getSelection = selector => {
    if (typeof selector === 'string') return [].slice.call(document.querySelectorAll(selector));
    if (selector instanceof Array) return selector;
    if (Object.prototype.isPrototypeOf.call(NodeList.prototype, selector)) return [].slice.call(selector);
    if (selector instanceof HTMLElement) return [selector];
    return [];
};

/*
 * Dispatch a custom event to the document
 *
 * @param type, String, name of the event
 * @param store, Object, store of the current instance state
 */
export const broadcast = (type, store) => () => {
    const event = new CustomEvent(type, {
        bubbles: true,
        detail: {
            getState: store.getState
        }
    });
    window.document.dispatchEvent(event);
};

export const debounce = (func, delay = 200) => {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

/*
 * Resolve a status message that may be either a plain string or a function of
 * some context (e.g. queryTooShortMsg takes minlength). Lets messages either
 * interpolate config or stay as static strings / data-* overrides.
 */
export const resolveMsg = (msg, ...args) => (typeof msg === 'function' ? msg(...args) : msg);

export const defaultSearch = values => query => values.filter(item => item.toLowerCase().includes(query.toLowerCase()));

/*
 * Default search over an array of option objects, matching the query against
 * each option's display text (template). Used when the source is a <select> or
 * an object list and the consumer hasn't supplied their own search.
 */
export const filterOptions = (options, template) => query => options.filter(option => template(option).toLowerCase().includes(query.toLowerCase()));

const toOption = option => ({ value: option.value, label: option.textContent.trim() });

/*
 * Progressive enhancement: derive an autocomplete source from a native <select>.
 * Its non-placeholder <option>s (value !== '') become { value, label } items,
 * pre-selected options seed the initial selection, and its name/multiple carry
 * over to the enhanced combobox.
 */
export const fromSelect = select => {
    const usable = [...select.options].filter(option => option.value !== '');
    return {
        options: usable.map(toOption),
        //seed from options the author explicitly marked selected (the attribute,
        //not the live .selected property, which a browser defaults to the first option)
        selected: usable.filter(option => option.hasAttribute('selected')).map(toOption),
        name: select.getAttribute('name'),
        multiple: select.multiple
    };
};

export const areEqual = (first, second) => {
    //compare two arrays
    if (first.length !== second.length) return false;
    return JSON.stringify(first) === JSON.stringify(second);
};

let count = 0;
/*
 * Returns a process-unique id with the given prefix, so each instance's
 * input / listbox / option ids and aria-controls wiring stay collision-free
 * when several autocompletes share a page.
 */
export const uid = prefix => `${prefix}-${++count}`;

export const isPrintableKeyCode = keyCode => (
    (keyCode > 47 && keyCode < 58) || // number keys
    keyCode === 32 || keyCode === 8 || // spacebar or backspace
    (keyCode > 64 && keyCode < 91) || // letter keys
    (keyCode > 95 && keyCode < 112) || // numpad keys
    (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
    (keyCode > 218 && keyCode < 223) // [\]' (in order)
);
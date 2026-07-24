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
 * some context (e.g. hintMsg takes minlength). Lets messages either
 * interpolate config or stay as static strings / data-* overrides.
 */
export const resolveMsg = (msg, ...args) => (typeof msg === 'function' ? msg(...args) : msg);

/*
 * Cap the number of search results shown, keeping the list short and scannable
 * (mirrors the ~6 suggestion limit used by the Scottish Government Design System).
 * A non-positive or non-finite maxResults (0, false, Infinity) disables the cap.
 */
export const capResults = (options, maxResults) => {
    const max = Number(maxResults);
    return Number.isFinite(max) && max > 0 ? options.slice(0, max) : options;
};

/*
 * Normalise a `values` array to the component's { value, label } option shape:
 * a plain string becomes { value, label } (both the string), an option object is
 * used as-is. So the built-in search and the default option.value templates work
 * whether values are supplied as strings or as objects — matching the <select> and
 * object-list paths.
 */
export const fromValues = values => values.map(value => (typeof value === 'string' ? { value, label: value } : value));

/*
 * Default search over an array of option objects, matching the query against
 * each option's display text (template). Used when the source is a <select> or
 * an object list and the consumer hasn't supplied their own search.
 */
export const filterOptions = (options, template) => query => options.filter(option => template(option).toLowerCase().includes(query.toLowerCase()));

const toOption = option => ({ value: option.value, label: option.textContent.trim() });

/*
 * Progressive enhancement: derive autocomplete source from a native <select>.
 * Non-placeholder <option>s (value !== '') become { value, label } items.
 * Pre-selected options seed initial selection, name/multiple carry over to the enhanced combobox
 */
export const fromSelect = select => {
    const selectableOptions = [...select.options].filter(option => option.value !== '');
    return {
        options: selectableOptions.map(toOption),
        selected: selectableOptions.filter(option => option.hasAttribute('selected')).map(toOption),
        name: select.getAttribute('name'),
        multiple: select.multiple
    };
};

export const areEqual = (first, second) => {
    //compare two arrays
    if (first.length !== second.length) return false;
    return JSON.stringify(first) === JSON.stringify(second);
};

/*
 * Returns a process-unique id with the given prefix, so each instance's
 * input / listbox / option ids and aria-controls wiring stay collision-free
 * when several autocompletes share a page.
 */
export const uid = (() => {
    let count = 0;
    return prefix => `${prefix}-${++count}`;
})();

/*
 * Escapes a string for safe interpolation into an HTML template literal, so an
 * optionTemplate that returns HTML (rendered via innerHTML) can't let untrusted 
 * values inject markup. 
 *
 * @param value [String]
 *
 * @returns [String]
 */
export const escapeHtml = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/*
 * Tagged template for building an optionTemplate's HTML string: the static markup
 * (the template's own tags) is left untouched, while every interpolated ${value} is
 * run through escapeHtml. The author writes html`<span>${option.label}</span>` and any
 * untrusted values can't inject markup.
 */
export const html = (strings, ...values) =>
    strings.reduce((out, string, i) => `${out}${string}${i < values.length ? escapeHtml(values[i]) : ''}`, '');

export const isPrintableKeyCode = keyCode => (
    (keyCode > 47 && keyCode < 58) || // number keys
    keyCode === 32 || keyCode === 8 || // spacebar or backspace
    (keyCode > 64 && keyCode < 91) || // letter keys
    (keyCode > 95 && keyCode < 112) || // numpad keys
    (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
    (keyCode > 218 && keyCode < 223) // [\]' (in order)
);
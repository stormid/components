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
 * Debounce a function by a configurable delay (settings.debounceDelay, in ms).
 * The delay is coerced because a data-* attribute always arrives as a string, and
 * anything that isn't a usable number of milliseconds falls back to the default.
 */
export const debounce = (func, delay) => {
    const num = Number(delay);
    const delayTime = Number.isFinite(num) && num >= 0 ? num : 200;
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delayTime);
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
 * Normalise a multiple-mode value/label source to an array. Init options can pass a
 * real array; a data-* attribute always arrives as a string, so a JSON-array string
 * (e.g. data-value='["GB","FR"]') is parsed to carry several server-rendered values,
 * while a plain string is treated as a single value.
 */
export const toValueArray = source => {
    if (Array.isArray(source)) return source;
    if (typeof source === 'string' && source.trim().startsWith('[')) {
        try {
            const parsed = JSON.parse(source);
            if (Array.isArray(parsed)) return parsed;
        } catch { /* not valid JSON — fall through to a single-value array */ }
    }
    return [].concat(source ?? []);
};

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
    //skip the placeholder (empty value) and disabled options — a disabled option must
    //not become a selectable suggestion
    const selectableOptions = [...select.options].filter(option => option.value !== '' && !option.disabled);
    return {
        options: selectableOptions.map(toOption),
        //an option counts as selected if it's live-selected (.selected — catches a
        //selection set by JS, restored from history, or autofilled before enhancement)
        //or carries the server-rendered `selected` attribute
        selected: selectableOptions.filter(option => option.selected || option.hasAttribute('selected')).map(toOption),
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
 * Escapes a string for safe interpolation into an HTML template literal, so untrusted
 * values can't inject markup. Applied by the html tag below to every interpolation.
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

class Html {
    constructor(value) {
        this.value = value;
    }
}

export const isHtml = value => value instanceof Html;

/*
 * Tagged template for an optionTemplate's markup: the template's own tags are left
 * alone, every interpolated ${value} is escaped. Returns branded Html rather than a
 * string, and only this tag mints one — so a hand-built string can't reach innerHTML
 * by mistake (see renderOptions), it renders as text instead.
 */
export const html = (strings, ...values) =>
    new Html(strings.reduce((out, string, i) => `${out}${string}${i < values.length ? escapeHtml(values[i]) : ''}`, ''));

export const isPrintableKeyCode = keyCode => (
    (keyCode > 47 && keyCode < 58) || // number keys
    keyCode === 32 || keyCode === 8 || // spacebar or backspace
    (keyCode > 64 && keyCode < 91) || // letter keys
    (keyCode > 95 && keyCode < 112) || // numpad keys
    (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
    (keyCode > 218 && keyCode < 223) // [\]' (in order)
);
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

/*
 * Settings that are Booleans/Numbers in defaults, and so need coercing when they arrive as
 * data-attributes (a DOMStringMap value is always a String).
 */
export const BOOLEAN_SETTINGS = ['startOpen', 'local', 'focus', 'trapTab', 'closeOnBlur', 'closeOnClick', 'useHidden'];
export const NUMBER_SETTINGS = ['delay'];

/*
 * Coerces the named settings into their intended types, so a value that arrived as a
 * data-attribute String opts in by its meaning rather than by being a non-empty String -
 * without this, data-start-open="false" is the truthy String 'false'. Applied to the fully
 * merged settings, so it holds whichever of options / data-attributes won the merge.
 *
 * @param settings, Object, merged defaults + options + data-attributes
 * @param booleans, Array of String, keys to coerce to Boolean
 * @param numbers, Array of String, keys to coerce to Number (an invalid value falls back to 0)
 * @return Object, settings with the named keys coerced
 */
export const coerceSettings = (settings, { booleans = [], numbers = [] } = {}) => {
    const coerced = { ...settings };
    booleans.forEach(key => { coerced[key] = coerced[key] === true || coerced[key] === 'true'; });
    numbers.forEach(key => { const n = Number(coerced[key]); coerced[key] = Number.isFinite(n) ? n : 0; });
    return coerced;
};

/*
 * Returns a process-unique id with the given prefix, so a toggled node that has no id of its own
 * can still be referenced by its triggers via aria-controls, collision-free when several toggles
 * share a page.
 */
export const uid = (() => {
    let count = 0;
    return prefix => `${prefix}-${++count}`;
})();

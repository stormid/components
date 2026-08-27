/*
 * Converts a passed selector which can be of varying types into an array of DOM Objects
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList, an HTMLCollection or a single DOM element.
 */
export const getSelection = selector => {
    if (typeof selector === 'string') return [].slice.call(document.querySelectorAll(selector));
    if (Array.isArray(selector)) return selector;
    if (selector instanceof NodeList || selector instanceof HTMLCollection) return [].slice.call(selector);
    if (selector && selector.nodeType === 1) return [selector]; // nodeType check is cross-realm safe, unlike instanceof HTMLElement
    return [];
};

/*
 * Settings that are Booleans in defaults, and so need coercing when they arrive as data-attributes
 */
const BOOLEAN_SETTINGS = ['startOpen', 'local', 'focus', 'trapTab', 'closeOnBlur', 'closeOnClick', 'useHidden'];

/*
 * Coerces settings sourced from data-attributes into their intended types.
 * Every dataset value is a String, so without this a data-attribute opts in whatever its value -
 * data-start-open="false" is the String 'false', which is truthy.
 *
 * data-toggle identifies the trigger elements, so it is structural markup rather than
 * configuration and is dropped rather than carried into settings as `toggle`.
 *
 * @param settings, Object, merged defaults + options + data-attributes
 * @return Object, settings with Boolean options and a numeric delay
 */
export const coerceSettings = settings => {
    const coerced = { ...settings, delay: Number(settings.delay) || 0 };
    delete coerced.toggle;
    BOOLEAN_SETTINGS.forEach(key => {
        coerced[key] = coerced[key] === true || coerced[key] === 'true';
    });
    return coerced;
};

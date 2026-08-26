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
 * Coerces settings sourced from data-attributes (always strings) and options into their intended types
 *
 * @param settings, Object, merged defaults + data-attributes + options
 * @return Object, settings with typed startOpen (Boolean) and delay (Number)
 */
export const coerceSettings = settings => ({
    ...settings,
    startOpen: settings.startOpen === true || settings.startOpen === 'true',
    delay: Number(settings.delay) || 0
});

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
/*
 * Converts a passed selector which can be of varying types into an array of DOM Objects
 *
 * @param selector, Can be a string, a single DOM element, an Array of DOM nodes,
 * a NodeList or an HTMLCollection.
 */
export const getSelection = selector => {
    if (typeof selector === 'string') return [].slice.call(document.querySelectorAll(selector));
    if (Array.isArray(selector)) return selector;
    // single DOM element (checked before array-likes so <form>/<select>, which expose a
    // numeric length, aren't mistaken for a collection)
    if (selector && selector.nodeType === 1) return [selector];
    // NodeList, HTMLCollection or any array-like collection of nodes
    if (selector && typeof selector.length === 'number') return [].slice.call(selector);
    return [];
};

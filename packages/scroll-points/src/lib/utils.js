/*
 * Converts a passed selector which can be of varying types into an array of DOM Objects
 *
 * @param selector, Can be a string, a single DOM element, an Array of DOM nodes,
 * a NodeList or an HTMLCollection.
 */
export const getSelection = selector => {
    if (typeof selector === 'string') return Array.from(document.querySelectorAll(selector));
    if (Array.isArray(selector)) return selector;
    if (selector instanceof NodeList || selector instanceof HTMLCollection) return Array.from(selector);
    if (selector && selector.nodeType === 1) return [selector]; // nodeType check is cross-realm safe, unlike instanceof HTMLElement
    return [];
};

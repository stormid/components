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
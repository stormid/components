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
 * Dispatch a custom event to the document
 *
 * @param type, String, name of the event
 * @param store, Object, store of the current instance state
 * @param detail, Object, additional properties merged into the event detail alongside getState
 */
export const broadcast = (type, store, detail = {}) => {
    const event = new CustomEvent(type, {
        bubbles: true,
        detail: { getState: store.getState, ...detail }
    });
    window.document.dispatchEvent(event);
};

/*
 * Wraps a function so it runs at most once per animation frame.
 * Returns a stable reference so the listener can be removed again in destroy().
 *
 * @param fn, Function to throttle
 * @return Function, throttled wrapper
 */
export const rafThrottle = fn => {
    let ticking = false;
    return (...args) => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            fn(...args);
            ticking = false;
        });
    };
};

export const getActiveIndexByHash = panels => {
    const hash = location.hash ? location.hash.slice(1) : false;
    if (!hash) return undefined;
    
    return panels.reduce((acc, panel, i) => {
        if (panel.getAttribute('id') === hash) acc = i;
        return acc;
    }, undefined);
};

export const getActiveIndexOnLoad = (panels, node) => (location.hash)
    ? getActiveIndexByHash(panels)
    : (node.getAttribute('data-active-index'))
        ? parseInt(node.getAttribute('data-active-index'), 10)
        : undefined;

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
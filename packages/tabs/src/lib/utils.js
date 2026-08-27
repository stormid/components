export const getActiveIndexByHash = panels => {
    const hash = location.hash ? location.hash.slice(1) : false;
    if (!hash) return undefined;
    
    return panels.reduce((acc, panel, i) => {
        if (panel.getAttribute('id') === hash) acc = i;
        return acc;
    }, undefined);
};

export const getActiveIndexOnLoad = (panels, node) => {
    const byHash = location.hash ? getActiveIndexByHash(panels) : undefined;
    if (byHash !== undefined) return byHash;

    const attr = node.getAttribute('data-active-index');
    return attr !== null ? parseInt(attr, 10) : undefined;
};

/*
 * Clamps a candidate index into a valid tab index, falling back to 0
 *
 * @param index, Number, candidate index (may be NaN or out of range)
 * @param length, Number, number of tabs
 * @return Number, a valid index in the range [0, length - 1]
 */
export const clampIndex = (index, length) => {
    if (!Number.isInteger(index) || index < 0 || index > length - 1) {
        if (index !== undefined && !Number.isNaN(index)) console.warn(`Tabs: activeIndex ${index} is out of range, defaulting to 0`);
        return 0;
    }
    return index;
};

/*
 * Coerces the string values of a DOMStringMap (node.dataset) so boolean
 * options set via data-attributes behave like their JS counterparts.
 * Only the literal tokens 'true'/'false' are converted - no string option
 * legitimately equals those values.
 *
 * @param dataset, DOMStringMap, node.dataset
 * @return Object, dataset with 'true'/'false' strings coerced to booleans
 */
export const coerceDataset = dataset => Object.keys(dataset).reduce((acc, key) => {
    const value = dataset[key];
    acc[key] = value === 'true' ? true : value === 'false' ? false : value;
    return acc;
}, {});

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
import defaults from './lib/defaults';

const isHidden = el => el.offsetParent === null;

const update = ({ target }) => {
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
};
const initObserver = el => {
    const observer = new MutationObserver(mutationsList => {
        update({ target: el });
    });
    observer.observe(el.parentNode, { attributes: true, attributeOldValue: true, attributeFilter: ['class', 'hidden']  });
};

/*
 * Converts a passed selector which can be of varying types into an array of DOM Objects
 *
 * @param selector, Can be a string, Array of DOM nodes, a NodeList or a single DOM element.
 */
export const getSelection = (selector) => {
    let nodes = [];

    if(typeof selector === "string") {
        nodes = [].slice.call(document.querySelectorAll(selector));
    } else if (selector instanceof Array) {
        nodes = selector;
    } else if (Object.prototype.isPrototypeOf.call(NodeList.prototype, selector)) {
        nodes = [].slice.call(selector);
    } else if (selector instanceof HTMLElement) {
        nodes.push(selector)
    }

    return nodes;
}

export default (selector, options) => {
    const nodes = getSelection(selector);
    const events = options && options.events || defaults.events;

    return nodes.map(node => {
        events.forEach(event => {
            node.addEventListener(event, update);
        });
        if (isHidden(node)) initObserver(node);
        update({ target: node });

        return {
            node,
            resize() {
                update({ target: node });
            }
        };
    });
};

import { EVENTS } from './constants.js';
import { broadcast } from './utils.js';

/*
 * Builds a spy { node, target } for every node whose href hash resolves to an element.
 * Nodes with a missing hash or an unresolvable target are warned about and skipped, so
 * the returned array never contains holes.
 */
export const findSpies = nodes => nodes.reduce((spies, node) => {
    //getElementById avoids the SyntaxError querySelector throws on ids that are valid HTML but not valid CSS selectors
    const target = node.hash && document.getElementById(decodeURIComponent(node.hash.slice(1)));
    if (!target) {
        console.warn('Scroll spy: node is missing an href hash or the hash target id does not exist');
        return spies;
    }
    spies.push({ node, target });
    return spies;
}, []);

/*
 * Reconciles the active className and aria-current attribute on every spy node with the
 * state's active array, and broadcasts scroll-spy.active/scroll-spy.inactive for each node
 * that actually changed.
 */
export const setActive = store => state => {
    const { settings, spies, active, hasScrolledToBottom } = state;

    //Work out whether a given spy should currently be carrying the active state
    const shouldBeActive = spy => {
        const index = active.indexOf(spy);
        if (index === -1) return false;
        //If the user has scrolled to the bottom we want the last active element to win,
        //even if it hasn't passed the threshold
        if (hasScrolledToBottom) return index === active.length - 1;
        //Otherwise, if a single active element is required it's always the top-most in the active array
        if (settings.single) return index === 0;
        return true;
    };

    spies.forEach(spy => {
        const isActive = spy.node.classList.contains(settings.activeClassName);
        const nextActive = shouldBeActive(spy);
        if (nextActive === isActive) return;

        if (nextActive) {
            spy.node.classList.add(settings.activeClassName);
            spy.node.setAttribute('aria-current', 'true');
            broadcast(EVENTS.ACTIVE, store, { node: spy.node, target: spy.target });
        } else {
            spy.node.classList.remove(settings.activeClassName);
            spy.node.removeAttribute('aria-current');
            broadcast(EVENTS.INACTIVE, store, { node: spy.node, target: spy.target });
        }
    });
};

import { EVENTS } from './constants.js';
import { broadcast } from './utils.js';

/*
 * Builds a spy { node, target } for every node whose href hash resolves to an element.
 * Nodes with a missing hash or an unresolvable target are warned about and skipped, so
 * the returned array never contains holes.
 */
//decodeURIComponent throws a URIError on a malformed escape (e.g. an anchor href="#100%"), which
//would abort init for every spy; fall back to the raw id, mirroring the sibling skip package
const decodeHash = raw => {
    try { return decodeURIComponent(raw); } catch { return raw; }
};

export const findSpies = nodes => nodes.reduce((spies, node) => {
    //getElementById avoids the SyntaxError querySelector throws on ids that are valid HTML but not valid CSS selectors
    const target = node.hash && document.getElementById(decodeHash(node.hash.slice(1)));
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
        //Single-active mode: the top-most active element normally wins, but once scrolled to the
        //bottom the last one wins so a short final section can still light up. Multi-active mode
        //(single:false) keeps every intersecting element active - the bottom must not collapse it.
        if (settings.single) return index === (hasScrolledToBottom ? active.length - 1 : 0);
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

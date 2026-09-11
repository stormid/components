import defaults from './lib/defaults.js';
import { getSelection } from './lib/utils.js';

const supportsFieldSizing = () =>
    typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('field-sizing', 'content');

const px = value => parseFloat(value) || 0;

/*
 * Resize a textarea to fit its content.
 * Collapse the height first so scrollHeight reflects the true content height, then set
 * the height accounting for the element's box model. Window scroll (both axes) is
 * preserved because collapsing the height can shift the page.
 */
const measure = node => {
    const { scrollX, scrollY } = window;
    const cs = window.getComputedStyle(node);

    node.style.height = 'auto';
    const contentHeight = node.scrollHeight;

    node.style.height = cs.boxSizing === 'border-box'
        ? `${contentHeight + px(cs.borderTopWidth) + px(cs.borderBottomWidth)}px`
        : `${contentHeight - px(cs.paddingTop) - px(cs.paddingBottom)}px`;

    window.scrollTo(scrollX, scrollY);
};

export default (selector, options) => {
    const settings = { ...defaults, ...options };
    const nodes = getSelection(selector);
    const native = !settings.forceFallback && supportsFieldSizing();

    return nodes.map(node => {
        // Prefer the platform: field-sizing:content resizes with zero ongoing JS.
        if (native) {
            node.style.setProperty('field-sizing', 'content');

            return {
                node,
                resize() {},
                destroy() {
                    node.style.removeProperty('field-sizing');
                }
            };
        }

        // Fallback for browsers without field-sizing support.
        const handler = () => measure(node);
        settings.events.forEach(event => node.addEventListener(event, handler));

        // Recompute on width change (responsive reflow, late font load) and on
        // hidden -> visible reveals (0 -> N width). Guarding on width only avoids the
        // set-height -> observe feedback loop that observing height would create.
        let observer;
        if (typeof ResizeObserver !== 'undefined') {
            let previousWidth = null;
            observer = new ResizeObserver(entries => {
                const { width } = entries[0].contentRect;
                if (width === previousWidth) return;
                previousWidth = width;
                measure(node);
            });
            observer.observe(node);
        }

        measure(node);

        return {
            node,
            resize() {
                measure(node);
            },
            destroy() {
                settings.events.forEach(event => node.removeEventListener(event, handler));
                if (observer) observer.disconnect();
            }
        };
    });
};

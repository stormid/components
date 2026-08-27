import { MODES } from './constants.js';
/* node:coverage disable */
/*
 * Default settings used by a Tabs instance if not otherwise overwritten with config
 *
 * @property tabSelector, String, selector for a tab link  
 * @property activeClass, String, className added to active tab
 * @property updateUrl, Boolean, to replace the location hash with the active tab's fragment identifier
 * @property activation, string, 'auto' or 'manual' describes tab activation method.  
 * as per https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html or https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html
 * @property activeIndex, Number, index of initially active tab
 * @property focusOnLoad, Boolean, sets whether the page should focus on the first tab on load
 * @property onChange, Function|null, called with { activeIndex, tab, panel } whenever a tab is activated (not on initial load)
 */
export default {
    tabSelector: '[role=tab]',
    activeClass: 'is--active',
    updateUrl: true,
    activation: MODES.AUTO,
    activeIndex: 0,
    focusOnLoad: false,
    onChange: null
};
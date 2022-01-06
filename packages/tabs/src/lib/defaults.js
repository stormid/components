import { MODES } from './constants';
/* istanbul ignore file */
/*
 * Default settings used by a Tabs instance if not otherwise overwritten with config
 *
 * @property tabSelector, String, selector for a tab link  
 * @property currentClass, String, className added to active tab
 * @property updateURL, Boolean, to push tab fragment identifier to window location 
 * @property activation, string, 'auto' or 'manual' describes tab activation method.  
 * as per https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html or https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html
 * @property active, Number, index of initially active tab
 */
export default {
    tabSelector: '[role=tab]',
    activeClass: 'is--active',
    updateURL: true,
    activation: MODES.AUTO,
    activeIndex: 0
};
/* istanbul ignore file */
/*
 * Default settings used by a Tabs instance if not otherwise overwritten with config
 *
 * @property tabSelector, String, selector for a tab link  
 * @property currentClass, String, className added to active tab
 * @property updateURL, Boolean, to push tab fragment identifier to window location 
 * @property active, Number, index of initially active tab
 */
export default {
    tabSelector: '.js-tabs__link',
    activeClass: 'is--active',
    updateURL: true,
    activeIndex: 0
};
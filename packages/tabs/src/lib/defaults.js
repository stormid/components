/*
 * Default settings used by a Toggle instance if not otherwise overwritten with config
 *
 * @property titleSelector, String, selector for a tab link  
 * @property currentClass, String, className added to active tab
 * @property updateURL, Boolean, to push tab fragment identifier to window location 
 * @property active, Number, index of initially active tab
 */
export default {
	titleSelector: '.js-tabs__link',
    activeClass: 'is--active',
    updateURL: true,
    activeIndex: 0
};
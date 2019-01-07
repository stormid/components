/*
 * Default settings used by a Modal instance if not otherwise overwritten with config
 *
 * @property onClassName, String,
 * @property mainSelector, String
 * @property modalSelector, String
 * @property callback, Function
 */
export default {
	onClassName: 'is-active',
    mainSelector: 'main',
    modalSelector: '.js-modal',
    toggleSelectorAttribute: 'data-modal-toggle',
    callback: false
};
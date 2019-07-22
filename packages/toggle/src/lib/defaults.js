/* istanbul ignore file */
/*
 * Default settings used by a Toggle instance if not otherwise overwritten with config
 *
 * @property delay, Number, duration in milliseconds of toggle off process persistng animation state ('is--animating' on a global toggle) to support more granular off animations  
 * @property startOpen, Boolean, toggle should start in an open state
 * @property local, Boolean, toggle is localised in the DOM (claasName changes are made to the parentNode, not the documentElement)
 * @property prehook, Function, called before each toggle event begins
 * @property callback, Function, called after each toggle event completes
 * @property focus, Boolean, focus should change to the first focusable child of a toggled element when opened
 * @property trapTab, Boolean, the toggled element should trap tab (tabbing from last child item returns focus to the first) when open
 * @property closeOnBlur, Boolean, the toggled element should close when focus moves to a non-child element
 * @property closeOnClick, Boolean, the toggled element should close when a non-child element is clicked
 */
export default {
	delay: 0,
	startOpen: false,
	local: false,
	prehook: false,
	callback: false,
	focus: true,
	trapTab: false,
	closeOnBlur: false,
	closeOnClick: false
};
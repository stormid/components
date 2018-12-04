/*
 * Creates an eventHandler that is bindable (non-arrow, named function expression), with partially-applied settings
 * 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @returns handler fn:
 *  
 * @param e, Event, DOM event passed in eventListener
 */
const handleClick = settings => function handler(e){
	this.classList.toggle('clicked');
	!!(settings.callback && settings.callback.constructor && settings.callback.call && settings.callback.apply) && settings.callback.call(this);
};

/*
 * Adds listener to augmented DOM node, returns Object defining instance API
 * 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be augmented
 */
export default ({ settings, node }) => {
	node.addEventListener('click', handleClick(settings).bind(node), false);
	return { settings, node, handleClick: handleClick(settings) };
}; 
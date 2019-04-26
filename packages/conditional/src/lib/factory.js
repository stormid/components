/*
 * Creates an eventHandler that is bindable (non-arrow, named function expression), with partially-applied settings
 * 
 * @param targets, Array, HTMLElements
 * @param initialState, Boolean
 * @returns handler fn:
 *  
 * @param e, Event, DOM event passed in eventListener
 */
const handleChange = targets => function handler(e){
	targets.forEach(target => {
		if(this.checked && target.hasAttribute('hidden')) target.removeAttribute('hidden');
		else if(!this.checked && !target.hasAttribute('hidden')) target.setAttribute('hidden', 'hidden');
	});
};

/*
 * Adds listener to augmented DOM node, returns Object defining instance API
 * 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be augmented
 */
export default ({ node }) => {
	const selector = node.getAttribute('data-conditional-target');
	if(!selector) return console.warn(`No target selector found for Conditional ${node}`);
	const targets = [].slice.call(document.querySelectorAll(`.${selector}`));
	if(!targets) return console.warn(`No targets found for Conditional ${node}`);

	if(node.getAttribute('type') === 'radio') {
		[].slice.call(document.getElementsByName(node.getAttribute('name'))).forEach(el => {
			el.addEventListener('change', handleChange(targets).bind(node));
		});
	}
	else node.addEventListener('change', handleChange(targets, node.checked).bind(node));
	return { 
		node, 
		setState: handleChange(targets)
	};
};
import { createStore } from '../store';

/*
 * Adds listener to augmented DOM node, returns Object defining instance API
 * 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param node, HTMLElement, DOM node to be augmented
 */
export default ({ settings, tid }) => {
	const Store = createStore();
    // Store.dispatch(ACTIONS.SET_INITIAL_STATE, getInitialState(form, settings));
	
	// return { settings, node, handleClick: handleClick(settings) };
};

/*

pageview
screenview
event
transaction
item
exception
timing
send

*/
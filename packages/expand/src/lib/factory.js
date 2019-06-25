import { createStore } from './store';
import { setInitialState } from './reducers';
import { initListeners } from './dom';

export default ({ btn, settings }) => {
	const target = document.getElementById(btn.getAttribute('aria-controls'));
	if(!target) return console.warn(`Expand not initialised, no target found for`, btn);

	const Store = createStore();
	Store.dispatch(setInitialState, {
		btn,
		target,
		isHidden: target.classList.contains(settings.hiddenClass),
		settings
	}, [ initListeners(Store) ]);

	return Store;
}; 
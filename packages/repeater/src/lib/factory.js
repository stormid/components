import { createStore } from './store';
import { setInitialState } from './reducers';
import { initListeners } from './dom';

export default ({ btn, settings }) => {
	const Store = createStore();
	Store.dispatch(setInitialState, {
		btn,
		sets: [].slice.call(document.querySelectorAll(`.${btn.getAttribute('data-repeater-set')}`)),
		settings,
	}, [ initListeners(Store) ]);

	return {}
};
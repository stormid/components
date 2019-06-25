import { show, hide } from './reducers';

export const initListeners = Store => state => state.btn.addEventListener('click', toggle(Store));

const toggle = Store => function handler(e){
    if(!!e.keyCode && !~KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3)) return;
    const { isHidden } = Store.getState();
    if(isHidden) Store.dispatch(show, { isHidden: false }, [ expand ])
    else Store.dispatch(hide, { isHidden: true }, [ contract ]);
	// !!(settings.callback && settings.callback.constructor && settings.callback.call && settings.callback.apply) && settings.callback.call(state);
};

const expand = state => {
    state.target.classList.remove(state.settings.hiddenClass);
    state.target.parentNode.classList.add(state.settings.expandedClass);
    state.btn.textContent = state.settings.closeLabel;
};

const contract = state => {
    state.target.classList.add(state.settings.hiddenClass);
    state.target.parentNode.classList.remove(state.settings.expandedClass);
    state.btn.textContent = state.settings.defaultLabel;
};
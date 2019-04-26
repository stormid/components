import { TRIGGER_EVENTS, KEYCODES, DATA_ATTRIBUTE } from './constants';
import { add, deleteSet } from './reducers';
import { canAddSet } from './utils';

//add eventListener to add button
//add eventListener to any delete buttons
export const initListeners = Store => state => {
    TRIGGER_EVENTS.forEach(ev => {
        state.btn.addEventListener(ev, e => {
            if(!!e.keyCode && !~KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3)) return;
            e.preventDefault();
            const { sets } = Store.getState();
            if(canAddSet(sets)) Store.dispatch(add, renderSet(Store), [ initDeleteListeners(Store) ]);
        });
    });
    state.sets.length > 0 && state.sets.forEach(initDeleteListener(Store));
};

const initDeleteListeners = Store => state => initDeleteListener(Store)(state.sets[state.sets.length - 1]);

//add eventListener to delete button
export const initDeleteListener = Store => set => {
    const deleteBtn = set.querySelector(`[${DATA_ATTRIBUTE.DELETE}]`);
    const setId = deleteBtn.getAttribute(DATA_ATTRIBUTE.DELETE);
    TRIGGER_EVENTS.forEach(ev => {
        deleteBtn.addEventListener(ev, e => {
            if(!!e.keyCode && !~KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3)) return;
            e.preventDefault();
            set.parentNode.removeChild(set);
            Store.dispatch(deleteSet, setId);
        });
    });
};

export const renderSet = Store => {
    const { btn, settings, sets,  } =  Store.getState();
    btn.insertAdjacentHTML('beforeBegin', settings.template(sets.length));
    btn.previousElementSibling.querySelector('input, select').focus();
    return btn.previousElementSibling;
};
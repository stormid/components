import { createStore } from '../store';
import { ACTIONS } from '../constants';
import reducers from '../reducers';
import { getInitialState } from '../validator';
import { validate }  from './validate';
import { clearErrors, addAXAttributes }  from '../dom';
import { addMethod } from './add-method';
import { addGroup, validateGroup, removeGroup } from './group';


/**
 * Default function, sets initial state and adds form-level event listeners
 * 
 * @param form [DOM node] the form to validate
 * 
 * @returns [Object] The API for the instance
 * *
 */
export default (form, settings) => {
    const store = createStore();
    store.update(reducers[ACTIONS.SET_INITIAL_STATE](getInitialState(form, settings)), [ addAXAttributes ]);
    form.addEventListener('submit', validate(store));
    form.addEventListener('reset', () => store.update(reducers[ACTIONS.CLEAR_ERRORS](store.getState()), [ clearErrors ]));

    return {
        getState: store.getState,
        validate: validate(store),
        addMethod: addMethod(store),
        addGroup: addGroup(store),
        validateGroup: validateGroup(store),
        removeGroup: removeGroup(store)
    };
};
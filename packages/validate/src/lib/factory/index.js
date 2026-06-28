import { createStore } from '../store/index.js';
import { ACTIONS } from '../constants/index.js';
import reducers from '../reducers/index.js';
import { getInitialState } from '../validator/index.js';
import { validate }  from './validate.js';
import { clearErrors, addAXAttributes }  from '../dom/index.js';
import { addMethod } from './add-method.js';
import { addGroup, validateGroup, removeGroup } from './group.js';


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
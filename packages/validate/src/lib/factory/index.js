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
    //form-level listeners are bound to this controller's signal so destroy() can remove them.
    //Per-group real-time listeners get their own controllers (see initRealTimeValidation) so a
    //single group can be torn down by removeGroup.
    const controller = new AbortController();
    store.update(reducers[ACTIONS.SET_INITIAL_STATE]({ ...getInitialState(form, settings), controller }), [ addAXAttributes ]);
    form.addEventListener('submit', validate(store), { signal: controller.signal });
    form.addEventListener('reset', () => store.update(reducers[ACTIONS.CLEAR_ERRORS](store.getState()), [ clearErrors ]), { signal: controller.signal });

    return {
        getState: store.getState,
        validate: validate(store),
        addMethod: addMethod(store),
        addGroup: addGroup(store),
        validateGroup: validateGroup(store),
        removeGroup: removeGroup(store),
        //remove every listener this instance added: the form-level ones and each group's real-time ones
        destroy: () => {
            const state = store.getState();
            state.controller.abort();
            Object.keys(state.groups).forEach(groupName => {
                if (state.groups[groupName].controller) state.groups[groupName].controller.abort();
            });
        }
    };
};
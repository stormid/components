import { ACTIONS } from '../constants';
import reducers from '../reducers';
import {
    getValidityState,
    reduceGroupValidityState,
    isFormValid,
    reduceErrorMessages
} from '../validator';
import { postValidation } from '../validator/post-validation';
import { initRealTimeValidation } from '../validator/real-time-validation';
import {
    clearErrors,
    renderErrors,
    focusFirstInvalidField
}  from '../dom';

/**
 * Returns a function that extracts the validityState of the entire form
 * can be used as a form submit eventListener or via the API
 * 
 * Submits the form if called as a submit eventListener and is valid
 * Dispatches error state to store if errors
 * 
 * @param form [DOM node]
 * 
 * @returns [Promise] Resolves with boolean validityState of the form
 * 
 */
export const validate = store => event => {
    event && event.preventDefault();
    store.update(reducers[ACTIONS.CLEAR_ERRORS](store.getState()), [clearErrors]);

    return new Promise(resolve => {
        const state = store.getState();
        const { groups, realTimeValidation } = state;
        getValidityState(groups)
            .then(validityState => {
                if (isFormValid(validityState)) return postValidation(event, resolve, store);

                if (realTimeValidation === false) initRealTimeValidation(store);

                store.update(
                    reducers[ACTIONS.VALIDATION_ERRORS](store.getState(), Object.keys(groups)
                        .reduce((acc, group, i) => (acc[group] = {
                            valid: validityState[i].reduce(reduceGroupValidityState, true),
                            errorMessages: validityState[i].reduce(reduceErrorMessages(group, state), [])
                        }, acc), {})),
                    [renderErrors, focusFirstInvalidField]
                );

                return resolve(false);
            }).catch(err => console.warn(err));
    });
};
import { ACTIONS } from '../constants/index.js';
import reducers from '../reducers/index.js';
import {
    getValidityState,
    reduceGroupValidityState,
    isFormValid,
    reduceErrorMessages
} from '../validator/index.js';
import { postValidation, submitForm } from '../validator/post-validation.js';
import { initRealTimeValidation } from '../validator/real-time-validation.js';
import {
    clearErrors,
    renderErrors,
    focusFirstInvalidField
}  from '../dom/index.js';

/**
 * Returns a function that extracts the validityState of the entire form
 * can be used as a form submit eventListener or via the API
 * 
 * Submits the form if called as a submit eventListener and is valid
 * Dispatches error state to store if errors
 * Skips validation if the form was submitted by a button with formnovalidate
 *
 * @param form [DOM node]
 *
 * @returns [Promise] Resolves with boolean validityState of the form, once submitted if called as a submit eventListener
 *                    Rejects if rendering the errors, the preSubmitHook or submitting the form throws
 *
 */
export const validate = store => event => {
    if (event && event.submitter && event.submitter.hasAttribute('formnovalidate')) {
        //leave the submission to the browser, unless there's a custom submit function to call instead
        if (!store.getState().settings.submit) return Promise.resolve(true);
        event.preventDefault();
        //submitted inside the promise so a throwing submit function rejects, as it does after validation
        return new Promise(resolve => {
            submitForm(store, event.submitter);
            resolve(true);
        });
    }

    event && event.preventDefault();

    const state = store.getState();
    const { groups, realTimeValidation } = state;

    //validators settle even when they fail (see getGroupValidityState), so a rejection here is an
    //error thrown afterwards: it rejects the returned promise rather than leaving it pending.
    //Errors are not cleared before validating: renderErrors clears the valid groups and leaves unchanged
    //errors in place, so re-submitting doesn't remove and re-render them.
    return getValidityState(groups)
        .then(validityState => {
            if (isFormValid(validityState)) {
                store.update(reducers[ACTIONS.CLEAR_ERRORS](store.getState()), [clearErrors]);
                return postValidation(event, store);
            }

            if (realTimeValidation === false) initRealTimeValidation(store);

            store.update(
                reducers[ACTIONS.VALIDATION_ERRORS](store.getState(), Object.keys(groups)
                    .reduce((acc, group, i) => (acc[group] = {
                        valid: validityState[i].reduce(reduceGroupValidityState, true),
                        errorMessages: validityState[i].reduce(reduceErrorMessages(group, state), [])
                    }, acc), {})),
                [renderErrors, focusFirstInvalidField]
            );

            return false;
        });
};
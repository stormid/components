import { ACTIONS } from '../constants';
import reducers from '../reducers';

/**
 * Adds a custom validation method to the validation model, used via the API
 * Dispatches add validation method to store to update the validators in a group
 * 
 * @param groupName [String] The name attribute shared by the DOM nodes in the group
 * @param method [Function] The validation method (function that returns true or false) that is called on the group
 * @param message [String] Te error message displayed if the validation method returns false
 * 
 */
export const addMethod = store => (groupName, method, message, fields) => {
    if ((groupName === undefined || method === undefined || message === undefined) || !store.getState()[groupName] && (document.getElementsByName(groupName).length === 0  && [].slice.call(document.querySelectorAll(`[data-val-group="${groupName}"]`)).length === 0) && !fields) {
        return console.warn('Custom validation method cannot be added.');
    }
    store.update(reducers[ACTIONS.ADD_VALIDATION_METHOD](store.getState(), { groupName, fields, validator: { type: 'custom', method, message } }));
};
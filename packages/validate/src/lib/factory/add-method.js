import { ACTIONS, GROUP_ATTRIBUTE } from '../constants/index.js';
import reducers from '../reducers/index.js';

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
    const hasRequiredArgs = groupName !== undefined && method !== undefined && message !== undefined;
    //the group must be resolvable to fields: already tracked in state, matchable by name or
    //data-val-group in the DOM, or supplied explicitly via the fields argument.
    const groupExists = hasRequiredArgs && !!store.getState().groups[groupName];
    const hasNamedFields = hasRequiredArgs && document.getElementsByName(groupName).length > 0;
    const hasGroupAttrFields = hasRequiredArgs && document.querySelectorAll(`[data-val-${GROUP_ATTRIBUTE}="${groupName}"]`).length > 0;
    const canResolveGroup = groupExists || hasNamedFields || hasGroupAttrFields || !!fields;

    if (!hasRequiredArgs || !canResolveGroup) {
        return console.warn('Custom validation method cannot be added.');
    }
    store.update(reducers[ACTIONS.ADD_VALIDATION_METHOD](store.getState(), { groupName, fields, validator: { type: 'custom', method, message } }));
};
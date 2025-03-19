import {
    removeUnvalidatableGroups,
    assembleValidationGroup,
    getGroupValidityState,
    reduceGroupValidityState,
    reduceErrorMessages } from '../validator';
import { initRealTimeValidation } from '../validator/real-time-validation';
import { renderError, clearError, addAXAttributes } from '../dom';
import { ACTIONS } from '../constants';
import reducers from '../reducers';

/**
 * Adds a group to the validation model, used via the API
 * Dispatches add group method to store 
 * 
 * @param nodes [Array], nodes comprising the group
 * 
 */
export const addGroup = store => nodes => {
    const groups = removeUnvalidatableGroups(nodes.reduce(assembleValidationGroup, {}));
    if (Object.keys(groups).length === 0) return console.warn('Group cannot be added.');

    store.update(reducers[ACTIONS.ADD_GROUP](store.getState(), groups), [ addAXAttributes, () => {
        if (store.getState().realTimeValidation) {
            //if we're already in realtime validation then we need to re-start it with the newly added group
            initRealTimeValidation(store);
        }
    }]);
};

/**
 * Validates a group individually, used via the API
 * 
 * @param groupName, nodes comprising the group to be validated
 * 
 * @returns [Promise] Resolves with boolean validityState of the group
 */
export const validateGroup = store => groupName => new Promise(resolve => {
    if (!store.getState().groups[groupName].valid && store.getState().errors[groupName]) {
        store.update(reducers[ACTIONS.CLEAR_ERROR](store.getState(), groupName), [clearError(groupName)]);
    }
    getGroupValidityState(store.getState().groups[groupName])
        .then(res => {
            if (!res.reduce(reduceGroupValidityState, true)) {
                store.update(
                    reducers[ACTIONS.VALIDATION_ERROR](store.getState(), {
                        group: groupName,
                        errorMessages: res.reduce(reduceErrorMessages(groupName, store.getState()), [])
                    }),
                    [renderError(groupName)]
                );
                return resolve(false);
            }
            return resolve(true);
        });
});

/**
 * Removes a group from the validation model, used via the API
 * Dispatches remove group method to store 
 * 
 * @param groupName, nodes comprising the group
 * 
 */
export const removeGroup = store => groupName => {
    const state = store.getState();
    if (state.errors[groupName]) clearError(groupName)(state);
    store.update(reducers[ACTIONS.REMOVE_GROUP](store.getState(), groupName));
};
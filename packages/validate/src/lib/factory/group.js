import { 
    removeUnvalidatableGroups, 
    assembleValidationGroup, 
    getGroupValidityState, 
    reduceGroupValidityState,
    reduceErrorMessages } from '../validator';
import { initRealTimeValidation } from '../validator/real-time-validation';
import { renderError, clearError, addAXAttributes } from '../dom';
import { ACTIONS } from '../constants';

/**
 * Adds a group to the validation model, used via the API
 * Dispatches add group method to store 
 * 
 * @param nodes [Array], nodes comprising the group
 * 
 */
export const addGroup = Store => nodes => {
    const groups = removeUnvalidatableGroups(nodes.reduce(assembleValidationGroup, {}));
    if (Object.keys(groups).length === 0) return console.warn('Group cannot be added.');

    Store.dispatch(ACTIONS.ADD_GROUP, groups, [ addAXAttributes, () => {
        if (Store.getState().realTimeValidation) {
            //if we're already in realtime validation then we need to re-start it with the newly added group
            initRealTimeValidation(Store);
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
export const validateGroup = Store => groupName => {
    return new Promise(resolve => {
        if(!Store.getState().groups[groupName].valid && Store.getState().errors[groupName]) {
            Store.dispatch(ACTIONS.CLEAR_ERROR, groupName, [clearError(groupName)]);
        }
        getGroupValidityState(Store.getState().groups[groupName])
        .then(res => {
            if(!res.reduce(reduceGroupValidityState, true)) {
                Store.dispatch(
                    ACTIONS.VALIDATION_ERROR,
                    {
                        group: groupName,
                        errorMessages: res.reduce(reduceErrorMessages(groupName, Store.getState()), [])
                    },
                    [renderError(groupName)]
                );
                return resolve(false);
            }
            return resolve(true);
        });
    })
};

/**
 * Removes a group from the validation model, used via the API
 * Dispatches remove group method to store 
 * 
 * @param groupName, nodes comprising the group
 * 
 */
export const removeGroup = Store => groupName => {
    const state = Store.getState();
    if (state.errors[groupName]) clearError(groupName)(state);
    Store.dispatch(ACTIONS.REMOVE_GROUP, groupName);
};
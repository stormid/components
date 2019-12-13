import { removeUnvalidatableGroups, assembleValidationGroup } from '../validator';
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
    if (!Object.keys(groups)) return console.warn('Group cannot be added.');

    Store.dispatch(ACTIONS.ADD_GROUP, groups);
};

/**
 * Removes a group to the validation model, used via the API
 * Dispatches remove group method to store 
 * 
 * @param groupName, nodes comprising the group
 * 
 */
export const removeGroup = Store => groupName => {
    Store.dispatch(ACTIONS.REMOVE_GROUP, groupName);
};
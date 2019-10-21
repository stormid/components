import { createStore } from '../store';
import { ACTIONS, PREHOOK_DELAY } from '../constants';
import { isSubmitButton, hasNameValue } from '../validator/utils';
import { 
    getInitialState,
    getValidityState,
    getGroupValidityState,
    reduceGroupValidityState,
    resolveRealTimeValidationEvent,
    reduceErrorMessages,
    removeUnvalidatableGroups,
    assembleValidationGroup
} from '../validator';
import {
    clearErrors,
    clearError,
    renderError,
    renderErrors,
    focusFirstInvalidField,
    createButtonValueNode,
    cleanupButtonValueNode
}  from '../dom';

/**
 * Returns a function that extracts the validityState of the entire form
 * can be used as a form submit eventListener or via the API
 * 
 * Submits the form if called as a submit eventListener and is valid
 * Dispatches error state to Store if errors
 * 
 * @param form [DOM node]
 * 
 * @returns [Promise] Resolves with boolean validityState of the form
 * 
 */
const validate = Store => e => {
    e && e.preventDefault();
    Store.dispatch(ACTIONS.CLEAR_ERRORS, null, [clearErrors]);

    return new Promise(res => {
        getValidityState(Store.getState().groups)
            .then(validityState => {
                if([].concat(...validityState).reduce(reduceGroupValidityState, true)){
                    let buttonValueNode = false;
                    if(isSubmitButton(document.activeElement) && hasNameValue(document.activeElement)) {
                        buttonValueNode = createButtonValueNode(document.activeElement, Store.getState().form);
                    }
                    if(e && e.target) {
                        if(Store.getState().settings.preSubmitHook) {
                            Store.getState().settings.preSubmitHook();
                            window.setTimeout(() => {(Store.getState().settings.submit || Store.getState().form.submit)(); }, PREHOOK_DELAY);
                        } else {
                            if(Store.getState().settings.submit) Store.getState().settings.submit();
                            else Store.getState().form.submit();
                        }
                    }               
                    buttonValueNode && cleanupButtonValueNode(buttonValueNode);
                    return res(true);
                }

                Store.getState().realTimeValidation === false && startRealTimeValidation(Store);

                Store.dispatch(
                    ACTIONS.VALIDATION_ERRORS,
                    Object.keys(Store.getState().groups)
                        .reduce((acc, group, i) => {                                         
                            return acc[group] = {
                                valid: validityState[i].reduce(reduceGroupValidityState, true),
                                errorMessages: validityState[i].reduce(reduceErrorMessages(group, Store.getState()), [])
                            }, acc;
                        }, {}),
                    [renderErrors, focusFirstInvalidField]
                );

                return res(false);
            })
            .catch(err => console.warn(err))
    });
};

/**
 * Adds a custom validation method to the validation model, used via the API
 * Dispatches add validation method to store to update the validators in a group
 * 
 * @param groupName [String] The name attribute shared by the DOM nodes in the group
 * @param method [Function] The validation method (function that returns true or false) that us called on the group
 * @param message [String] Te error message displayed if the validation method returns false
 * 
 */
const addMethod = Store => (groupName, method, message) => {
    if((groupName === undefined || method === undefined || message === undefined) || !Store.getState()[groupName] && document.getElementsByName(groupName).length === 0)
        return console.warn('Custom validation method cannot be added.');

    Store.dispatch(ACTIONS.ADD_VALIDATION_METHOD, { groupName, validator: { type: 'custom', method, message }});
};

/**
 * Adds a group to the validation model, used via the API
 * Dispatches add group method to store 
 * 
 * @param nodes [Array], nodes comprising the group
 * 
 */
const addGroup = Store => nodes => {
    const groups = removeUnvalidatableGroups(nodes.reduce(assembleValidationGroup, {}));
    if(!Object.keys(groups)) return console.warn('Group cannot be added.');

    Store.dispatch(ACTIONS.ADD_GROUP, groups);
};

/**
 * Removes a group to the validation model, used via the API
 * Dispatches remove group method to store 
 * 
 * @param groupName, nodes comprising the group
 * 
 */
const removeGroup = Store => groupName => {
    Store.dispatch(ACTIONS.REMOVE_GROUP, groupName);
};

/**
 * Starts real-time validation on each group, adding an eventListener to each field 
 * that resets the validityState for the field's group and acquires the new validity state
 * 
 * The event that triggers validation is defined by the field type
 * 
 * Only if the new validityState is invalid is the validation error object 
 * dispatched to the store to update state and render the error
 * 
 */
const startRealTimeValidation = Store => {
    let handler = groupName => () => {
        if(!Store.getState().groups[groupName].valid) {
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
                    }
            });
    };

    Object.keys(Store.getState().groups).forEach(groupName => {
        Store.getState().groups[groupName].fields.forEach(input => {
            input.addEventListener(resolveRealTimeValidationEvent(input), handler(groupName));
        });
        //;_; can do better?
        let equalToValidator = Store.getState().groups[groupName].validators.filter(validator => validator.type === 'equalto');
        
        if(equalToValidator.length > 0){
            equalToValidator[0].params.other.forEach(subgroup => {
                subgroup.forEach(item => { item.addEventListener('blur', handler(groupName)); });
            });
        }
    });
};

/**
 * Default function, sets initial state and adds form-level event listeners
 * 
 * @param form [DOM node] the form to validate
 * 
 * @returns [Object] The API for the instance
 * *
 */
export default (form, settings = {}) => {
    const Store = createStore();
    Store.dispatch(ACTIONS.SET_INITIAL_STATE, getInitialState(form, settings));
    form.addEventListener('submit', validate(Store));
    form.addEventListener('reset', () => { Store.update(UPDATES.CLEAR_ERRORS, null, [clearErrors]); });

    return {
        getState: Store.getState,
        validate: validate(Store),
        addMethod: addMethod(Store),
        addGroup: addGroup(Store),
        removeGroup: removeGroup(Store)
    }
};
import { ACTIONS } from '../constants/index.js';
import reducers from '../reducers/index.js';
import {
    getGroupValidityState,
    resolveRealTimeValidationEvent,
    reduceGroupValidityState,
    reduceErrorMessages
} from './index.js';
import {
    clearError,
    renderError
}  from '../dom/index.js';
import { updateErrorSummary } from '../dom/error-summary.js';

/**
 * Starts real-time validation on each group, adding an eventListener to each field
 * that acquires the new validity state for the field's group
 * 
 * The event that triggers validation is defined by the field type
 * 
 * An invalid validityState dispatches the validation error object to the store to update state and render
 * the error; a valid one clears any error the group has
 * 
 */
export const initRealTimeValidation = store => {
    const handler = groupName => () => {
        //the current error stays in place until the new result is known (rather than being cleared up front),
        //so that renderError can leave an unchanged message alone instead of re-rendering it on every keystroke
        getGroupValidityState(store.getState().groups[groupName])
            .then(res => {
                //bail if the group was removed or the instance destroyed while a (possibly remote)
                //check was in flight: the group may be gone from state (renderError would throw) or
                //the whole form torn down (an error rendered into a dead form).
                const current = store.getState();
                if (!current.groups[groupName] || (current.controller && current.controller.signal.aborted)) return;
                if (res.reduce(reduceGroupValidityState, true)) {
                    if (!current.groups[groupName].valid && current.errors[groupName]) {
                        store.update(reducers[ACTIONS.CLEAR_ERROR](current, groupName), [ clearError(groupName), updateErrorSummary ]);
                    }
                } else {
                    store.update(
                        reducers[ACTIONS.VALIDATION_ERROR](store.getState(),
                            {
                                group: groupName,
                                errorMessages: res.reduce(reduceErrorMessages(groupName, store.getState()), [])
                            }),
                        [ renderError(groupName), updateErrorSummary ]
                    );
                }
            });
    };

    Object.keys(store.getState().groups).forEach(groupName => {
        const group = store.getState().groups[groupName];
        if (group.hasEvent) return;

        //per-group controller so removeGroup/destroy can detach just this group's listeners
        const controller = new AbortController();
        const { signal } = controller;

        group.fields.forEach(input => {
            input.addEventListener(resolveRealTimeValidationEvent(input), handler(groupName), { signal });
        });

        const equalToValidator = group.validators.filter(validator => validator.type === 'equalto');

        if (equalToValidator.length > 0){
            equalToValidator[0].params.other.forEach(subgroup => {
                subgroup.forEach(item => {
                    item.addEventListener('blur', handler(groupName), { signal });
                });
            });
        }

        //record listener state immutably through the reducer rather than mutating the group in place
        store.update(reducers[ACTIONS.START_REALTIME](store.getState(), {
            groups: {
                ...store.getState().groups,
                [groupName]: { ...group, hasEvent: true, controller }
            }
        }));
    });
};
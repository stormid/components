import { ACTIONS } from '../constants';
import reducers from '../reducers';
import {
    getGroupValidityState,
    resolveRealTimeValidationEvent,
    reduceGroupValidityState,
    reduceErrorMessages
} from './';
import {
    clearError,
    renderError
}  from '../dom';

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
export const initRealTimeValidation = store => {
    const handler = groupName => () => {
        const { groups, errors } = store.getState();
        
        if (!groups[groupName].valid && errors[groupName]) {
            store.update(reducers[ACTIONS.CLEAR_ERROR](store.getState(), groupName), [ clearError(groupName) ]);
        }
        getGroupValidityState(groups[groupName])
            .then(res => {
                if (!res.reduce(reduceGroupValidityState, true)) {
                    store.update(
                        reducers[ACTIONS.VALIDATION_ERROR](store.getState(),
                            {
                                group: groupName,
                                errorMessages: res.reduce(reduceErrorMessages(groupName, store.getState()), [])
                            }),
                        [ renderError(groupName) ]
                    );
                }
            });
    };

    Object.keys(store.getState().groups).forEach(groupName => {

        const { groups } = store.getState();
        const groupUpdate = { ...groups };
        
        if (!groupUpdate[groupName].hasEvent) {
            groupUpdate[groupName].fields.forEach(input => {
                input.addEventListener(resolveRealTimeValidationEvent(input), handler(groupName));
            });

            //;_; can do better?
            const equalToValidator = groupUpdate[groupName].validators.filter(validator => validator.type === 'equalto');
            
            if (equalToValidator.length > 0){
                equalToValidator[0].params.other.forEach(subgroup => {
                    subgroup.forEach(item => {
                        item.addEventListener('blur', handler(groupName));
                    });
                });
            }
            
            groupUpdate[groupName].hasEvent = true;
        }
      
        store.update(reducers[ACTIONS.START_REALTIME](store.getState(), {
            groups: groupUpdate
        }));
    });
};
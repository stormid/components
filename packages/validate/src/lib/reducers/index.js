import { ACTIONS, DOTNET_ERROR_SPAN_DATA_ATTRIBUTE } from '../constants';

/**
 * All state/model-modifying operations
 */
export default {
    [ACTIONS.SET_INITIAL_STATE]: (state, data) => Object.assign({}, state, data),
    [ACTIONS.CLEAR_ERRORS]: state => Object.assign({}, state, { 
        groups: Object.keys(state.groups).reduce((acc, group) => {
            acc[group] = Object.assign({}, state.groups[group], {
                errorMessages: [],
                valid: true
            });
            return acc;
        }, {})
    }),
    [ACTIONS.CLEAR_ERROR]: (state, data) => Object.assign({}, state, {
        groups: Object.assign({}, state.groups, {
            [data]: Object.assign({}, state.groups[data], {
                errorMessages: [],
                valid: true
            })
        })
    }),
    [ACTIONS.ADD_VALIDATION_METHOD]: (state, data) => Object.assign({}, state, {
        groups: Object.assign({}, state.groups, {
            [data.groupName]: Object.assign({}, state.groups[data.groupName] ? state.groups[data.groupName] : {},
                                                state.groups[data.groupName] ?  { validators: [...state.groups[data.groupName].validators, data.validator] }
                                                : {
                                                    fields: [].slice.call(document.getElementsByName(data.groupName)),
                                                    serverErrorNode: document.querySelector(`[${DOTNET_ERROR_SPAN_DATA_ATTRIBUTE}=${data.groupName}]`) || false,
                                                    valid: false,
                                                    validators: [data.validator],
                                                })
        })
    }),
    [ACTIONS.VALIDATION_ERRORS]: (state, data) => {
        return Object.assign({}, state, {
            realTimeValidation: true,
            groups: Object.keys(state.groups).reduce((acc, group) => {
                acc[group] = Object.assign({}, state.groups[group], data[group]);
                return acc;
            }, {})
        });
    },
    [ACTIONS.VALIDATION_ERROR]: (state, data) => {
        return Object.assign({}, state, {
            groups: Object.assign({}, state.groups, {
                [data.group]: Object.assign({}, state.groups[data.group], {
                    errorMessages: data.errorMessages,
                    valid: false
                })
            })
        })
    }
};
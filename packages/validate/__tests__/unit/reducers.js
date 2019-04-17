import { ACTIONS } from '../../src/lib/constants';
import Reducers from '../../src/lib/reducers';

/*
SET_INITIAL_STATE: 'SET_INITIAL_STATE',
    CLEAR_ERRORS: 'CLEAR_ERRORS',
    VALIDATION_ERRORS: 'VALIDATION_ERRORS',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    ADD_VALIDATION_METHOD: 'ADD_VALIDATION_METHOD'
*/

//set initial state
describe('Validate > Unit > Reducers > Set initial state', () => {
  	it('should compose a new object based on default empty state object and initial payload', async () => {
        const state = {};
        const nextState = {
            form: document.createElement('form'),
            groups: {
                group1: {
                    valid: false,
                    fields: [document.createElement('input')],
                    validators: []
                }
            },
            errorNodes: {},
            realTimeValidation: false
        };
        const output = Reducers[ACTIONS.SET_INITIAL_STATE](state, nextState);
        expect(output).toEqual(nextState);
    });
});

//clear errors
describe('Validate > Unit > Reducers > Clear errors', () => {
  	it('should compose a new object with each group Object containing an empty array of errorMessages and a true validity property', async () => {
        const state = {
            form: document.createElement('form'),
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: ['This field is required'],
                    valid: false
                },
                group2: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: ['This field is required'],
                    valid: false
                }
            },
            errorNodes: {},
            realTimeValidation: false
        };
        const output = Reducers[ACTIONS.CLEAR_ERRORS](state);
        expect(output).toEqual({
            form: document.createElement('form'),
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: [],
                    valid: true
                },
                group2: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: [],
                    valid: true
                }
            },
            errorNodes: {},
            realTimeValidation: false
        });
    });
});

//clear error
describe('Validate > Unit > Reducers > Clear error', () => {
  	it('should compose a new object with a group Object containing an empty array of errorMessages and a true validity property for a given group name', async () => {
        const state = {
            form: document.createElement('form'),
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: ['This field is required'],
                    valid: false
                },
                group2: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: ['This field is required'],
                    valid: false
                }
            },
            errorNodes: {},
            realTimeValidation: false
        };
        const output = Reducers[ACTIONS.CLEAR_ERROR](state, 'group1');
        expect(output).toEqual({
            form: document.createElement('form'),
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: [],
                    valid: true
                },
                group2: {
                    fields: [document.createElement('input')],
                    validators: [],
                     errorMessages: ['This field is required'],
                    valid: false
                }
            },
            errorNodes: {},
            realTimeValidation: false
        });
    });
})

//add validation errors
// describe('Validate > Unit > Reducers > Add validation errors', () => {
//   	it('should compose a new object with group Objects containing an array of errorMessages and a false validity property', async () => {
//         const state = {
//             groups: {
//                 group1: {
//                     fields: [document.createElement('input')],
//                     validators: [],
//                     valid: true
//                 },
//                 group2: {
//                     fields: [document.createElement('input')],
//                     validators: [],
//                     valid: true
//                 }
//             }
//         };
//         const nextState = {
//             groups: {
//                 group1: {
//                     fields: [document.createElement('input')],
//                     validators: [],
//                     errorMessages: ['This field is required'],
//                     valid: false
//                 },
//                 group2: {
//                     fields: [document.createElement('input')],
//                     validators: [],
//                     errorMessages: ['This field is required'],
//                     valid: false
//                 }
//             }
//         };
//         const output = Reducers[ACTIONS.VALIDATION_ERRORS](state, nextState);
//         expect(output).toEqual({
//             realTimeValidation: true,
//             groups: {
//                 group1: {
//                     fields: [document.createElement('input')],
//                     validators: [],
//                     errorMessages: ['This field is required'],
//                     valid: false
//                 },
//                 group2: {
//                     fields: [document.createElement('input')],
//                     validators: [],
//                     errorMessages: ['This field is required'],
//                     valid: false
//                 }
//             },
//             errorNodes: {},
//         });
//       });
// });
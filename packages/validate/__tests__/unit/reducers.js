import { ACTIONS } from '../../src/lib/constants';
import Reducers from '../../src/lib/reducers';

//set initial state
describe('Validate > Unit > Reducers > Set initial state', () => {
    it('should compose a new object based on default empty state object and initial payload', async () => {
        expect.assertions(1);
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
        expect.assertions(1);
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
        expect.assertions(1);
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
});

//add validation errors
describe('Validate > Unit > Reducers > Add validation errors', () => {
    it('should compose a new object with group Objects containing an array of errorMessages and a false validity property', async () => {
        expect.assertions(1);
        const state = {
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    valid: true
                },
                group2: {
                    fields: [document.createElement('input')],
                    validators: [],
                    valid: true
                }
            }
        };
        const nextState = {
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
        };
        const output = Reducers[ACTIONS.VALIDATION_ERRORS](state, nextState);
        expect(output).toEqual({
            realTimeValidation: true,
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
            }
        });
    });
});


//add validation error
describe('Validate > Unit > Reducers > Add validation error', () => {
    it('should compose a new Object updating one of the group Objects with an array of errorMessages and a false validity property', async () => {
        expect.assertions(1);
        const state = {
            realTimeValidation: true,
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    valid: true
                },
                group2: {
                    fields: [document.createElement('input')],
                    validators: [],
                    valid: true
                }
            }
        };
        const nextState = {
            group: 'group1',
            errorMessages: ['This field is required']
        };
        const output = Reducers[ACTIONS.VALIDATION_ERROR](state, nextState);
        expect(output).toEqual({
            realTimeValidation: true,
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
                    valid: true
                }
            }
        });
    });
});

//add validation method
describe('Validate > Unit > Reducers > Add validation method', () => {
    it('should add a validator of type custom to an existing field group', async () => {
        expect.assertions(1);
        const validatorFn = (value, fields, param) => false;
        const state = {
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    valid: false
                },
                group2: {
                    fields: [document.createElement('input')],
                    validators: [],
                    valid: false
                }
            }
        };
        const nextState = {
            groupName: 'group1',
            validator: { type: 'custom', validatorFn, message: 'This field can never be valid' }
        };
        const output = Reducers[ACTIONS.ADD_VALIDATION_METHOD](state, nextState);
        expect(output).toEqual({
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [{ type: 'custom', validatorFn, message: 'This field can never be valid' }],
                    valid: false
                },
                group2: {
                    fields: [document.createElement('input')],
                    validators: [],
                    valid: false
                }
            }
        });
    });
    it('should add a validator of type custom and create a new group', async () => {
        expect.assertions(1);
        const validatorFn = (value, fields, param) => false;
        document.body.innerHTML = `<form class="form" method="post" action="">
            <label for="group1">Text</label>
            <input id="group1" name="group1" type="text">
        </form>`;
        
        const nextState = {
            groupName: 'group1',
            validator: { type: 'custom', validatorFn, message: 'This field can never be valid' }
        };
        const state = { groups: {} };
        const input = document.getElementById('group1');
        const output = Reducers[ACTIONS.ADD_VALIDATION_METHOD](state, nextState);
        expect(output).toEqual({
            groups: {
                group1: {
                    fields: [input],
                    validators: [{ type: 'custom', validatorFn, message: 'This field can never be valid' }],
                    serverErrorNode: false,
                    valid: false
                }
            }
        });
    });
});

//Add group
describe('Validate > Unit > Reducers > Add group', () => {
    it('should add a new validation group', async () => {
        expect.assertions(1);
        // const validatorFn = (value, fields, param) => false;
        const state = {
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
                    valid: false
                }
            }
        };
        const newGroup = {
            group3: {
                fields: [document.createElement('input')],
                validators: [],
                valid: false
            }
        };
        const output = Reducers[ACTIONS.ADD_GROUP](state, newGroup);
        expect(output).toEqual({
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
                    valid: false
                },
                group3: {
                    fields: [document.createElement('input')],
                    validators: [],
                    valid: false
                }
            }
        });
    });
});

//Remove group
describe('Validate > Unit > Reducers > Remove group', () => {
    it('should remove a validation group', async () => {
        expect.assertions(1);
        // const validatorFn = (value, fields, param) => false;
        const state = {
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
                    valid: false
                }
            }
        };
        const output = Reducers[ACTIONS.REMOVE_GROUP](state, 'group2');
        expect(output).toEqual({
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: ['This field is required'],
                    valid: false
                }
            }
        });
    });
});
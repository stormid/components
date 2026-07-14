import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ACTIONS, GROUP_ATTRIBUTE } from '../../src/lib/constants/index.js';
import Reducers from '../../src/lib/reducers/index.js';

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
            errors: {},
            realTimeValidation: false
        };
        const output = Reducers[ACTIONS.SET_INITIAL_STATE](state, nextState);
        assert.deepStrictEqual(output, nextState);
    });
});

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
            errors: {},
            realTimeValidation: false
        };
        const output = Reducers[ACTIONS.CLEAR_ERRORS](state);
        assert.deepStrictEqual(output, {
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
            errors: {},
            realTimeValidation: false
        });
    });
});

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
            errors: {},
            realTimeValidation: false
        };
        const output = Reducers[ACTIONS.CLEAR_ERROR](state, 'group1');
        assert.deepStrictEqual(output, {
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
            errors: {},
            realTimeValidation: false
        });
    });
});

describe('Validate > Unit > Reducers > Add validation errors', () => {
    it('should compose a new object with group Objects containing an array of errorMessages and a false validity property', async () => {
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
        assert.deepStrictEqual(output, {
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

describe('Validate > Unit > Reducers > Add validation error', () => {
    it('should compose a new Object updating one of the group Objects with an array of errorMessages and a false validity property', async () => {
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
        assert.deepStrictEqual(output, {
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

describe('Validate > Unit > Reducers > Add validation method', () => {
    it('should add a validator of type custom to an existing field group', async () => {
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
        assert.deepStrictEqual(output, {
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
        assert.deepStrictEqual(output, {
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
    
    it('should add a validator and collect fields based on group data attribute', async () => {
        const validatorFn = (value, fields, param) => false;
        document.body.innerHTML = `<form class="form" method="post" action="">
            <label for="group1">Text</label>
            <input id="group1" name="group1" data-val-${GROUP_ATTRIBUTE}="groupX" type="text">
        </form>`;
        
        //set new group name to data group attribute, not name attribute
        const nextState = {
            groupName: 'groupX',
            validator: { type: 'custom', validatorFn, message: 'This field can never be valid' }
        };
        const state = { groups: {} };
        //select field based on data attribute
        const fields = [].slice.call(document.querySelectorAll(`[data-val-${GROUP_ATTRIBUTE}="groupX"]`));
        const output = Reducers[ACTIONS.ADD_VALIDATION_METHOD](state, nextState);
        assert.deepStrictEqual(output, {
            groups: {
                groupX: { //data attribute group name used as group key, not name attribute
                    fields,
                    validators: [{ type: 'custom', validatorFn, message: 'This field can never be valid' }],
                    serverErrorNode: false,
                    valid: false
                }
            }
        });
    });

    it('should add a validator with an array of fields', async () => {
        const validatorFn = (value, fields, param) => false;
        document.body.innerHTML = `<form class="form" method="post" action="">
            <label for="group1">Text</label>
            <input id="group1" name="group1"  type="text">
        </form>`;
        const input = document.getElementById('group1');
        
        const nextState = {
            groupName: 'CustomGroup',
            fields: [ input ],
            validator: {
                type: 'custom',
                validatorFn,
                message: 'This field can never be valid'
            }
        };
        const state = { groups: {} };
        const output = Reducers[ACTIONS.ADD_VALIDATION_METHOD](state, nextState);
        assert.deepStrictEqual(output, {
            groups: {
                CustomGroup: {
                    fields: [ input ],
                    validators: [{ type: 'custom', validatorFn, message: 'This field can never be valid' }],
                    serverErrorNode: false,
                    valid: false
                }
            }
        });
    });
});

describe('Validate > Unit > Reducers > Add group', () => {
    it('should add a new validation group', async () => {
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
            },
            errors: {}
        };
        const newGroup = {
            group3: {
                fields: [document.createElement('input')],
                validators: [],
                valid: false
            }
        };
        const output = Reducers[ACTIONS.ADD_GROUP](state, newGroup, {});
        assert.deepStrictEqual(output, {
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
            },
            errors: {}
        });
    });
});

describe('Validate > Unit > Reducers > Remove group', () => {
    it('should remove a validation group', async () => {
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
        assert.deepStrictEqual(output, {
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

    it('should remove errors associated with a validation group', async () => {
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
            },
            errors: {
                group1: 'This field is required',
                group2: 'This field is required'
            }
        };
        const output = Reducers[ACTIONS.REMOVE_GROUP](state, 'group2');
        assert.deepStrictEqual(output, {
            groups: {
                group1: {
                    fields: [document.createElement('input')],
                    validators: [],
                    errorMessages: ['This field is required'],
                    valid: false
                }
            },
            errors: {
                group1: 'This field is required'
            }
        });
    });
});
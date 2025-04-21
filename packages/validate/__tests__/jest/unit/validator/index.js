import {
    resolveParam,
    extractParams,
    extractDataValValidators,
    extractAttrValidators,
    extractErrorMessage,
    removeUnvalidatableGroups,
    getInitialState
} from '../../../../src/lib/validator';
import defaults from '../../../../src/lib/defaults';

//resolveParam
describe('Validate > Unit > Validator > resolveParam', () => {
    it('should return a param Object indexed by second part of param name and String value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
        id="group1"
        name="group1"
        data-val="true"
        data-val-length="Please enter between 2 and 8 characters"
        data-val-required="This field is required"
        data-val-length-min="2"
        data-val-length-max="8"
        type="text">`;
        const input = document.querySelector('#group1');
        const param = 'length-min';
        const resolved = resolveParam(param, input);
        expect(resolved).toEqual({ min: '2' });
    });
    it('should return a param Object indexed by second part of param name, and an array of arrays of DOMNodes', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input data-val="true" 
                    data-val-required="The field is required." 
                    id="Email"
                    name="Email"
                    value="example@stormid.com" />
                    <input data-val="true" 
                    data-val-required="The field is required." 
                    id="ConfirmEmail"
                    name="ConfirmEmail"
                    value="example@stormid.com" />
                <input data-val="true" 
                        data-val-equalto="Should match the previous field"
                        data-val-equalto-other="Email,ConfirmEmail"
                        id="DoubleConfirmEmail"
                        name="DoubleConfirmEmail"
                        value="" />`;
        const input = document.querySelector('#DoubleConfirmEmail');
        const firstTarget = document.querySelector('#Email');
        const secondTarget = document.querySelector('#ConfirmEmail');
        const param = 'equalto-other';
        const resolved = resolveParam(param, input);
        expect(resolved).toEqual({ other: [[firstTarget], [secondTarget]] });
    });
});


//extractParams
describe('Validate > Unit > Validator > extractParams', () => {
    it('should return false when supplied an unknown .NET MVC adaptors/validation method', async () => {
        expect.assertions(1);
        expect(extractParams(null, 'unknown-adaptor')).toEqual(false);
    });
    it('should return an Object containing all parameters for matched adaptor/validation method on an input', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
        id="group1"
        name="group1"
        data-val="true"
        data-val-length="Please enter between 2 and 8 characters"
        data-val-required="This field is required"
        data-val-length-min="2"
        data-val-length-max="8"
        type="text">`;
        const input = document.querySelector('#group1');
        expect(extractParams(input, 'length')).toEqual({
            params: { min: '2', max: '8' }
        });
    });
});

//extractDataValValidators
describe('Validate > Unit > Validator > extractDataValValidators', () => {
    it('should return an empty array if a given node does not contain data-attributes defining known validators', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
                    id="group1"
                    name="group1"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(extractDataValValidators(input)).toEqual([]);
    });

    it('should return an array of validator Objects for a given node containing data-attributes defining known validators', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
                id="group1"
                name="group1"
                data-val="true"
                data-val-length="Please enter between 2 and 8 characters"
                data-val-required="This field is required"
                data-val-length-min="2"
                data-val-length-max="8"
                type="text">`;
        const input = document.querySelector('#group1');
        expect(extractDataValValidators(input)).toEqual([
            { type: 'required', message: 'This field is required' },
            { type: 'length', message: 'Please enter between 2 and 8 characters', params: { min: '2', max: '8' } }
        ]);
    });
});

//extractAttrValidators
describe('Validate > Unit > Validator > extractAttrValidators', () => {
    it('should return an empty array if a given node does not contain HTML5 constraint validation attributes', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(extractAttrValidators(input)).toEqual([]);
    });

    it('should return an array of validator Objects for a given node containing HTML5 constraint validation attributes', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<input
                id="group1"
                name="group1"
                min="2"
                max="8"
                required
                type="text">
                <input
                id="group2"
                name="group2"
                minlength="2"
                maxlength="8"
                required
                type="text">`;
        const input1 = document.querySelector('#group1');
        const input2 = document.querySelector('#group2');
        expect(extractAttrValidators(input1)).toEqual([
            { type: 'required' },
            { type: 'min', params: { min: '2' } },
            { type: 'max', params: { max: '8' } }
        ]);
        expect(extractAttrValidators(input2)).toEqual([
            { type: 'required' },
            { type: 'minlength', params: { min: '2' } },
            { type: 'maxlength', params: { max: '8' } }
        ]);
    });
});

//normaliseValidators --> see integration tests


//validate --> see integration validate tests

//assembleValidationGroup -> see integration assembleValidationGroup tests

//extractErrorMessage
describe('Validate > Unit > Validator > extractErrorMessage', () => {
    it('should return an error message given a validator containing a message', async () => {
        expect.assertions(1);
        const MESSAGE = 'This field is required';
        const validator = { message: MESSAGE };

        expect(extractErrorMessage(defaults.messages, validator)).toEqual(MESSAGE);
    });

    it('should return an error message based on constants and params given a validator without an error message', async () => {
        expect.assertions(9);
        const requiredValidator = { type: 'required' };
        const emailValidator = { type: 'email' };
        const patternValidator = { type: 'pattern' };
        const URLValidator = { type: 'url' };
        const numberValidator = { type: 'number' };
        const maxValidator = { type: 'max', params: { max: 10 } };
        const minValidator = { type: 'min', params: { min: 2 } };
        const maxLengthValidator = { type: 'maxlength',  params: { max: 10 } };
        const minLengthValidator = { type: 'minlength', params: { min: 2 } };

        expect(extractErrorMessage(defaults.messages, requiredValidator)).toEqual(defaults.messages.required());
        expect(extractErrorMessage(defaults.messages, emailValidator)).toEqual(defaults.messages.email());
        expect(extractErrorMessage(defaults.messages, patternValidator)).toEqual(defaults.messages.pattern());
        expect(extractErrorMessage(defaults.messages, URLValidator)).toEqual(defaults.messages.url());
        expect(extractErrorMessage(defaults.messages, numberValidator)).toEqual(defaults.messages.number());
        expect(extractErrorMessage(defaults.messages, maxValidator)).toEqual(defaults.messages.max(maxValidator.params));
        expect(extractErrorMessage(defaults.messages, minValidator)).toEqual(defaults.messages.min(minValidator.params));
        expect(extractErrorMessage(defaults.messages, maxLengthValidator)).toEqual(defaults.messages.maxlength(maxLengthValidator.params));
        expect(extractErrorMessage(defaults.messages, minLengthValidator)).toEqual(defaults.messages.minlength(minLengthValidator.params));
    });

});


// To do
// can do better here, factory > validate function in need of refactor
//
//extractErrorMessage


describe('Validate > Unit > Validator > removeUnvalidatableGroups', () => {
    it('should remove groups that do not contain validators from the array of vaidationGroups', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            required
            type="text">
            <input
            id="group2"
            name="group2"
            type="text">`;
        const input1 = document.querySelector('#group1');
        const input2 = document.querySelector('#group2');
        let groups = {
            group1: {
                validators: [{ type: 'required', message: 'This field is required' }],
                fields: [ input1 ],
                errorMessages: [],
                valid: false
            },
            group2: {
                validators: [],
                fields: [ input2 ],
                errorMessages: [],
                valid: false
            }
        };

        expect(removeUnvalidatableGroups(groups)).toEqual({
            group1: {
                validators: [{ type: 'required', message: 'This field is required' }],
                fields: [input1],
                errorMessages: [],
                valid: false
            }
        });
    
    });

    it('should remove groups with all hidden fields from the array of validationGroups', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="i-1"
            name="group1"
            type="hidden">
            <input
            required
            id="i-2"
            name="group1"
            type="hidden">`;
        const input1 = document.querySelector('#i-1');
        const input2 = document.querySelector('#i-2');
        let groups = {
            group1: {
                validators: [{ type: 'required', message: 'This field is required' }],
                fields: [input1, input2],
                errorMessages: [],
                valid: false
            }
        };

        expect(removeUnvalidatableGroups(groups)).toEqual({});
    });

});

//getInitialState
describe('Validate > Unit > Validator > getInitialState', () => {
    it('should return a state object containing only groups that are validatable', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form><input
            id="group1"
            name="group1"
            required
            type="text">
            <input
            id="group2"
            name="group2"
            type="text"></form>`;
        const input1 = document.querySelector('#group1');
        // const input2 = document.querySelector('#group2');
        const form = document.querySelector('form');

        expect(getInitialState(form, {})).toEqual({
            form,
            settings: {},
            errors: {},
            realTimeValidation: false,
            groups: {
                group1: {
                    serverErrorNode: false,
                    validators: [{ type: 'required' }],
                    fields: [input1],
                    valid: false
                }
            }
        });
    });
    it('should return a state object containing any settings passed to init', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form><input
            id="group1"
            name="group1"
            required
            type="text">`;
        const input1 = document.querySelector('#group1');
        // const input2 = document.querySelector('#group2');
        const form = document.querySelector('form');

        expect(getInitialState(form, { preSubmitHook: true })).toEqual({
            form,
            settings: { preSubmitHook: true },
            errors: {},
            realTimeValidation: false,
            groups: {
                group1: {
                    serverErrorNode: false,
                    validators: [{ type: 'required' }],
                    fields: [input1],
                    valid: false
                }
            }
        });
    });
});
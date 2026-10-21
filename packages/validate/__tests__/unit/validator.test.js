import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    resolveParam,
    extractParams,
    extractDataValValidators,
    removeUnvalidatableGroups,
    getInitialState
} from '../../src/lib/validator/index.js';

describe('Validate > Unit > Validator > resolveParam', () => {
    it('should return a param Object indexed by second part of param name and String value', async () => {
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
        assert.deepStrictEqual(resolved, { min: '2' });
    });

    it('should return a param Object indexed by second part of param name, and an array of arrays of DOMNodes', async () => {
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
        assert.deepStrictEqual(resolved, { other: [[firstTarget], [secondTarget]] });
    });
});

describe('Validate > Unit > Validator > extractParams', () => {
    it('should return false when supplied an unknown .NET MVC adaptors/validation method', async () => {
        assert.deepStrictEqual(extractParams(null, 'unknown-adaptor'), false);
    });

    it('should return an Object containing all parameters for matched adaptor/validation method on an input', async () => {
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
        assert.deepStrictEqual(extractParams(input, 'length'), {
            params: { min: '2', max: '8' }
        });
    });
});

describe('Validate > Unit > Validator > extractDataValValidators', () => {
    it('should return an empty array if a given node does not contain data-attributes defining known validators', async () => {
        document.body.innerHTML = `<input
                    id="group1"
                    name="group1"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(extractDataValValidators(input), []);
    });

    it('should return an array of validator Objects for a given node containing data-attributes defining known validators', async () => {
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
        assert.deepStrictEqual(extractDataValValidators(input), [
            { type: 'required', message: 'This field is required' },
            { type: 'length', message: 'Please enter between 2 and 8 characters', params: { min: '2', max: '8' } }
        ]);
    });
});

describe('Validate > Unit > Validator > removeUnvalidatableGroups', () => {
    it('should remove groups that do not contain validators from the array of vaidationGroups', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true" data-val-required="This field is required"
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

        assert.deepStrictEqual(removeUnvalidatableGroups(groups), {
            group1: {
                validators: [{ type: 'required', message: 'This field is required' }],
                fields: [input1],
                errorMessages: [],
                valid: false
            }
        });
    });

    it('should remove groups with all hidden fields from the array of validationGroups', async () => {
        document.body.innerHTML = `<input
            id="i-1"
            name="group1"
            type="hidden">
            <input
            data-val="true" data-val-required="This field is required"
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
        assert.deepStrictEqual(removeUnvalidatableGroups(groups), {});
    });
});

describe('Validate > Unit > Validator > getInitialState', () => {
    it('should return a state object containing only groups that are validatable', async () => {
        document.body.innerHTML = `<form><input
            id="group1"
            name="group1"
            data-val="true" data-val-required="This field is required"
            type="text">
            <input
            id="group2"
            name="group2"
            type="text"></form>`;
        const input1 = document.querySelector('#group1');
        const form = document.querySelector('form');

        assert.deepStrictEqual(getInitialState(form, {}), {
            form,
            settings: {},
            errors: {},
            realTimeValidation: false,
            groups: {
                group1: {
                    serverErrorNode: false,
                    validators: [{ type: 'required', message: 'This field is required' }],
                    fields: [input1],
                    valid: false
                }
            }
        });
    });
    
    it('should return a state object containing any settings passed to init', async () => {
        document.body.innerHTML = `<form><input
            id="group1"
            name="group1"
            data-val="true" data-val-required="This field is required"
            type="text">`;
        const input1 = document.querySelector('#group1');
        // const input2 = document.querySelector('#group2');
        const form = document.querySelector('form');

        assert.deepStrictEqual(getInitialState(form, { preSubmitHook: true }), {
            form,
            settings: { preSubmitHook: true },
            errors: {},
            realTimeValidation: false,
            groups: {
                group1: {
                    serverErrorNode: false,
                    validators: [{ type: 'required', message: 'This field is required' }],
                    fields: [input1],
                    valid: false
                }
            }
        });
    });
});
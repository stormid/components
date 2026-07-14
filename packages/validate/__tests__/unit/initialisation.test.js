import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../src/index.js';
import defaults from '../../src/lib/defaults/index.js';
import { getSelection } from '../../src/lib/validator/utils.js';

let validators;
const setUpDOM = () => {
    document.body.innerHTML = `<form class="form" method="post" action="">
        <label for="group1-1">Text (required, min 2 characters, max 8 characters)</label>
        <input id="group1-1" name="group1" data-val="true" data-val-length="Please enter between 2 and 8 characters" data-val-required="${defaults.messages.required()}" data-val-length-min="2" data-val-length-max="8" type="text">
        <span class="text-danger field-validation-valid" data-valmsg-for="group1" data-valmsg-replace="true"></span>
      </form>`;
};
const init = async () => {
    setUpDOM();
    validators = await validate('form');
};

describe('Validate > Initialisation', () => {
    before(init);
    it('should return an Object with validate and addMethod functions', async () => {
        assert.notStrictEqual(validators[0], null);
        assert.notStrictEqual(validators[0].validate, undefined);
        assert.notStrictEqual(validators[0].addMethod, undefined);
        assert.notStrictEqual(validators[0].getState, undefined);
    });

    it('should assign the form node as validator state property', async () => {
        assert.deepStrictEqual(validators[0].getState().form, document.querySelector('.form'));
    });

    it('should set a novalidate attribute on the form', async () => {
        assert.deepStrictEqual(validators[0].getState().form.getAttribute('novalidate'), 'novalidate');
    });

    it('should create an empty errors object property of the validator state if there are no server-rendered errors', async () => {
        assert.deepStrictEqual(validators[0].getState().errors, {});
    });

    it('should create a realTimeValidation boolean property of the validator state set to false while the form is not dirty', async () => {
        assert.deepStrictEqual(validators[0].getState().realTimeValidation, false);
    });
      
    it('should have the default settings in state if no options are passed', async () => {
        assert.deepStrictEqual(validators[0].getState().settings, defaults);
    });

    it('should create a groups property of the validator state', async () => {
        assert.notStrictEqual(validators[0].getState().groups, undefined);
    });

    it('should contain a group object for each field group, indexed by group name', async () => {
        assert.notStrictEqual(validators[0].getState().groups.group1, undefined);
    });

    it('validator state group objects should have a \'valid\' property initially set to false', async () => {
        assert.deepStrictEqual(validators[0].getState().groups.group1.valid, false);
    });
      
    it('validator state group objects should have an array of validators as a property', async () => {
        assert.deepStrictEqual(Array.isArray(validators[0].getState().groups.group1.validators), true);
    });

    it('validator state group validators should consist of a type, a message, and optional params', async () => {
        assert.deepStrictEqual(validators[0].getState().groups.group1.validators[0].type, 'required');
        assert.deepStrictEqual(validators[0].getState().groups.group1.validators[0].message, defaults.messages.required());
        assert.deepStrictEqual(validators[0].getState().groups.group1.validators[1].type, 'length');
        assert.deepStrictEqual(validators[0].getState().groups.group1.validators[1].message, 'Please enter between 2 and 8 characters');
        assert.deepStrictEqual(validators[0].getState().groups.group1.validators[1].params, { min: '2', max: '8' });
    });

    it('validator state group objects should have a fields array containing each field element in the group', async () => {
        assert.deepStrictEqual(Array.isArray(validators[0].getState().groups.group1.fields), true);
        assert.deepStrictEqual(validators[0].getState().groups.group1.fields.length, 1);
        assert.deepStrictEqual(validators[0].getState().groups.group1.fields[0], document.querySelector('#group1-1'));
    });

    it('validator state group objects can have a serverErrorNode property if a node exists when initialsed', async () => {
        assert.deepStrictEqual(validators[0].getState().groups.group1.serverErrorNode, document.querySelector('[data-valmsg-for="group1"]'));
    });
});


describe('Validate > Initialisation > DOM element', () => {
    it('should initialise when passed a DOM element', async () => {
        setUpDOM();
        const form = document.querySelector('.form');
        const validators = await validate(form);
        assert.notStrictEqual(validators[0], null);
        assert.notStrictEqual(validators[0].validate, undefined);
        assert.notStrictEqual(validators[0].addMethod, undefined);
        assert.notStrictEqual(validators[0].getState, undefined);
    });

    it('should initialise when passed a NodeList element', async () => {
        setUpDOM();
        const form = document.querySelectorAll('.form');
        const validators = await validate(form);
        assert.notStrictEqual(validators[0], null);
        assert.notStrictEqual(validators[0].validate, undefined);
        assert.notStrictEqual(validators[0].addMethod, undefined);
        assert.notStrictEqual(validators[0].getState, undefined);
    });

    it('should initialise when passed an array of DOM elements', async () => {
        setUpDOM();
        const form = document.querySelector('.form');
        const validators = await validate([form]);
        assert.notStrictEqual(validators[0], null);
        assert.notStrictEqual(validators[0].validate, undefined);
        assert.notStrictEqual(validators[0].addMethod, undefined);
        assert.notStrictEqual(validators[0].getState, undefined);
    });

    it('should initialise when passed a string', async () => {
        setUpDOM();
        const validators = await validate('.form');
        assert.notStrictEqual(validators[0], null);
        assert.notStrictEqual(validators[0].validate, undefined);
        assert.notStrictEqual(validators[0].addMethod, undefined);
        assert.notStrictEqual(validators[0].getState, undefined);
    });

});

describe('Validate > Initialisation > novalidate', () => {
    it('should not initialise when passed a form element (or selector identiying a form element) with a novalidate attribute', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="" novalidate>
            <label for="group1-1">Text (required, min 2 characters, max 8 characters)</label>
            <input id="group1-1" name="group1" data-val="true" data-val-length="Please enter between 2 and 8 characters" data-val-required="${defaults.messages.required()}" data-val-length-min="2" data-val-length-max="8" type="text">
            <span class="text-danger field-validation-valid" data-valmsg-for="group1" data-valmsg-replace="true"></span>
        </form>`;
        const validators = await validate('.form');
        assert.deepStrictEqual(validators, []);
    });
});

describe('Validate > Initialisation > server-side errors', () => {
    it('should collect server-rendered errors, convert to DOM nodes, and add to errors object property of the validator state', async () => {
        const serverRenderedErrorMessage = 'Please enter between 2 and 8 characters';
        document.body.innerHTML = `<form class="form" method="post" action="">
            <label for="group1-1">Text (required, min 2 characters, max 8 characters)</label>
            <input id="group1-1" name="group1" data-val="true" data-val-length="Please enter between 2 and 8 characters" data-val-required="${defaults.messages.required()}" data-val-length-min="2" data-val-length-max="8" type="text">
            <span class="text-danger field-validation-valid" data-valmsg-for="group1">${serverRenderedErrorMessage}</span>
        </form>`;
        const [ validator ] = await validate('.form');
        assert.deepStrictEqual(Object.keys(validator.getState().errors).length, 1);
        assert.deepStrictEqual(validator.getState().errors.group1, serverRenderedErrorMessage);
    });
});

describe('Validate > Initialisation > Get Selection', () => {
    it('should return an array when passed a DOM element', async () => {
        setUpDOM();
        const form = document.querySelector('.form');
        const els = getSelection(form);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a NodeList element', async () => {
        setUpDOM();
        const form = document.querySelectorAll('.form');
        const els = getSelection(form);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        setUpDOM();
        const form = document.querySelector('.form');
        const els = getSelection([form]);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a string', async () => {
        setUpDOM();
        const els = getSelection('.form');
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

});
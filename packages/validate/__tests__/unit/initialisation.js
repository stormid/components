import Validation from '../../src';
import messages from '../../src/lib/constants/messages';

let validators;
const init = async () => {
	// Set up our document body
	document.body.innerHTML = `<form class="form" method="post" action="">
		<label for="group1-1">Text (required, min 2 characters, max 8 characters)</label>
		<input id="group1-1" name="group1" data-val="true" data-val-length="Please enter between 2 and 8 characters" data-val-required="${messages.required()}" data-val-length-min="2" data-val-length-max="8" type="text">
		<span class="text-danger field-validation-valid" data-valmsg-for="group1" data-valmsg-replace="true"></span>
  	</form>`;
	validators = await Validation.init('form');
};

describe('Validate > Initialisation', () => {
	beforeAll(init);
  	it('should return an Object with validate and addMethod functions', async () => {
		expect(validators[0]).not.toBeNull();
	  	expect(validators[0]).not.toBeNull();
	  	expect(validators[0].validate).not.toBeUndefined();
	  	expect(validators[0].addMethod).not.toBeUndefined();
	  	expect(validators[0].getState).not.toBeUndefined();
  	});

	it('should assign the form node as validator state property', async () => {
		expect(validators[0].getState().form).toEqual(document.querySelector('.form'));
  	});

	it('should set a novalidate attribute on the form', async () => {
		expect(validators[0].getState().form.getAttribute('novalidate')).toEqual('novalidate');
  	});

	it('should create an empty errorNodes object property of the validator state', async () => {
		expect(validators[0].getState().errorNodes).toEqual({});
  	});

	it('should create a realTimeValidation boolean property of the validator state set to false while the form is not dirty', async () => {
		expect(validators[0].getState().realTimeValidation).toEqual(false);
  	});

	it('should create a groups property of the validator state', async () => {
		expect(validators[0].getState().groups).not.toBeUndefined();
  	});

	it('should contain a group object for each field group, indexed by group name', async () => {
		expect(validators[0].getState().groups['group1']).not.toBeUndefined();
  	});

	it('validator state group objects should have a \'valid\' property initially set to false', async () => {
		expect(validators[0].getState().groups['group1'].valid).toEqual(false);
  	});
	  
	it('validator state group objects should have an array of validators as a property', async () => {
		expect(Array.isArray(validators[0].getState().groups['group1'].validators)).toEqual(true);
  	});

	it('validator state group validators should consist of a type, a message, and optional params', async () => {
		expect(validators[0].getState().groups['group1'].validators[0].type).toEqual('required');
		expect(validators[0].getState().groups['group1'].validators[0].message).toEqual(messages.required());
		expect(validators[0].getState().groups['group1'].validators[1].type).toEqual('length');
		expect(validators[0].getState().groups['group1'].validators[1].message).toEqual('Please enter between 2 and 8 characters');
  		expect(validators[0].getState().groups['group1'].validators[1].params).toEqual({ min: '2', max: '8' });
  	});

	it('validator state group objects should have a fields array containing each field element in the group', async () => {
		expect(Array.isArray(validators[0].getState().groups['group1'].fields)).toEqual(true);
		expect(validators[0].getState().groups['group1'].fields.length).toEqual(1);
		expect(validators[0].getState().groups['group1'].fields[0]).toEqual(document.querySelector('#group1-1'));
  	});

	it('validator state group objects can have a serverErrorNode property if a node exists when initialsed', async () => {
		expect(validators[0].getState().groups['group1'].serverErrorNode).toEqual(document.querySelector('[data-valmsg-for="group1"]'));
  	});
});
import {
	resolveParam,
	extractParams,
	extractDataValValidators,
	extractAttrValidators
} from '../../../src/lib/validator';
import MESSAGES from '../../../src/lib/constants/messages';

//resolveParam
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
        expect(resolved).toEqual({ 'min': '2' });
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
      expect(resolved).toEqual({ 'other':  [[firstTarget],[secondTarget]] });
  	});
})


//extractParams
describe('Validate > Unit > Validator > extractParams', () => {
    it('should return false when supplied an unknown .NET MVC adaptors/validation method', async () => {
     	expect(extractParams(null, 'unknown-adaptor')).toEqual(false);
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
		expect(extractParams(input, 'length')).toEqual({
			params: { 'min': '2', 'max': '8' }
		});
	});
});

//extractDataValValidators
describe('Validate > Unit > Validator > extractDataValValidators', () => {
    it('should return an empty array if a given node does not contain data-attributes defining known validators', async () => {
		document.body.innerHTML = `<input
        id="group1"
        name="group1"
		type="text">`;
		const input = document.querySelector('#group1');
		expect(extractDataValValidators(input)).toEqual([]);
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
		expect(extractDataValValidators(input)).toEqual([
			{
				type: 'required',
				message: 'This field is required'
			},
			{
				type: 'length',
				message: 'Please enter between 2 and 8 characters',
				params: { 'min': '2', 'max': '8' }
			}
		]);
	});
});

//extractAttrValidators
describe('Validate > Unit > Validator > extractAttrValidators', () => {
    it('should an empty array if a given node does not contain HTML5 constraint validation attributes', async () => {
		document.body.innerHTML = `<input
			id="group1"
			name="group1"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(extractAttrValidators(input)).toEqual([]);
	});
	it('should return an array of validator Objects for a given node containing HTML5 constraint validation attributes', async () => {
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
	it('should return an array of validator Objects for a given node containing HTML5 constraint validation attributes', async () => {
		document.body.innerHTML = `<input
			id="group1"
			name="group1"
			min="2"
			max="8"
			required
			type="text">`;
		const input = document.querySelector('#group1');
		expect(extractAttrValidators(input)).toEqual([
			{ type: 'required' },
			{ type: 'min', params: { min: '2' } },
			{ type: 'max', params: { max: '8' } }
		]);
	});
});

//normaliseValidators

//validate
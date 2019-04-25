import {
	resolveParam,
	extractParams,
	extractDataValValidators
} from '../../../src/lib/validator';

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



/**
 * Reducer that takes all know .NET MVC adaptors (data-attributes that specifiy a validation method that should be papiied to the node)
 * and checks against a DOM node for matches, returning an array of validators
 * 
 * @param input [DOM node]
 * 
 * @return validators [Array], each validator compposed of 
 *                              type [String] naming the validator and matching it to validation method function
 *                              message [String] the error message displayed if the validation method returns false
 *                              params [Object] (optional) 

const extractDataValValidators = input => DOTNET_ADAPTORS.reduce((validators, adaptor) => 
                                                            !input.getAttribute(`data-val-${adaptor}`) 
                                                            ? validators 
                                                            : [...validators, 
                                                                Object.assign({
                                                                    type: adaptor,
                                                                    message: input.getAttribute(`data-val-${adaptor}`)}, 
                                                                    extractParams(input, adaptor)
                                                                )
                                                            ],
                                                        []);
*/
//extractDataValValidators
describe('Validate > Unit > Validator > extractDataValValidators', () => {
    it('should an empty array if a given node does not contain data-attributes defining known validators', async () => {
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
			},
		]);
	});
});
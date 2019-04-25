import { resolveParam } from '../../../src/lib/validator';

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
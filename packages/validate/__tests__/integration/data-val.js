import { normaliseValidators } from '../../src/lib/validator';


describe('Validate > Integration > data-val > required', () => {
    //validation model construction
  	it('should return the correct validation model for required', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="Required error message"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'required',
                message: 'Required error message'
            }
		]);
    });
});

describe('Validate > Integration > data-val > regex', () => {
    //validation model construction
    it('should return the correct validation model for regex', async () => {
      document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-regex="Regex error message"
          data-val-regex-pattern="[a-z]+$"
          type="text">`;
      const input = document.querySelector('#group1');
      expect(normaliseValidators(input)).toEqual([
          { 
              type: 'regex',
              message: 'Regex error message',
              params: { pattern: '[a-z]+$' } 
          }
      ]);
  });
});

describe('Validate > Integration > data-val > email', () => {
    //validation model construction
    it('should return the correct validation model for email', async () => {
      document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-email="Email error message"
          type="text">`;
      const input = document.querySelector('#group1');
      expect(normaliseValidators(input)).toEqual([
          { 
              type: 'email',
              message: 'Email error message'
          }
      ]);
  });
});

describe('Validate > Integration > data-val > number', () => {
    //validation model construction
    it('should return the correct validation model for number', async () => {
      document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-number="Number error message"
          type="text">`;
      const input = document.querySelector('#group1');
      expect(normaliseValidators(input)).toEqual([
          { 
              type: 'number',
              message: 'Number error message'
          }
      ]);
  });
});

describe('Validate > Integration > data-val > url', () => {
    //validation model construction
    it('should return the correct validation model for url', async () => {
      document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-url="Url error message"
          type="text">`;
      const input = document.querySelector('#group1');
      expect(normaliseValidators(input)).toEqual([
          { 
              type: 'url',
              message: 'Url error message'
          }
      ]);
  });
});

describe('Validate > Integration > data-val > length', () => {
    //validation model construction
    it('should return the correct validation model for length', async () => {
      document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-length="Length error message"
          data-val-length-min="2"
          data-val-length-max="8"
          type="text">`;
      const input = document.querySelector('#group1');
      expect(normaliseValidators(input)).toEqual([
          { 
              type: 'length',
              message: 'Length error message',
              params: {
                min: "2",
                max: "8"
              }
          }
      ]);
  });
});

describe('Validate > Integration > data-val > minlength', () => {
    //validation model construction
    it('should return the correct validation model for minlength', async () => {
      document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-minlength="Minlength error message"
          data-val-minlength-min="2"
          type="text">`;
      const input = document.querySelector('#group1');
      expect(normaliseValidators(input)).toEqual([
          { 
              type: 'minlength',
              message: 'Minlength error message',
              params: {
                min: "2"
              }
          }
      ]);
  });
});

describe('Validate > Integration > data-val > range', () => {
    //validation model construction
    it('should return the correct validation model for range', async () => {
      document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-range="Range error message"
          data-val-range-min="2"
          data-val-range-max="8"
          type="text">`;
      const input = document.querySelector('#group1');
      expect(normaliseValidators(input)).toEqual([
          { 
              type: 'range',
              message: 'Range error message',
              params: {
                min: "2",
                max: "8"
              }
          }
      ]);
  });
});

describe('Validate > Integration > data-val > equalto', () => {
    //validation model construction
    it('should return the correct validation model for equalto', async () => {
      document.body.innerHTML = `<input
        id="Email"
        name="Email"
        value="example@stormid.com" />
        <input
        id="ConfirmEmail"
        name="ConfirmEmail"
        value="example@stormid.com" />
        <input data-val="true" 
            data-val-equalto="Equalto error message"
            data-val-equalto-other="Email,ConfirmEmail"
            id="DoubleConfirmEmail"
            name="DoubleConfirmEmail"
          value="" />`;
      const input = document.querySelector('#DoubleConfirmEmail');
      const firstTarget = document.querySelector('#Email');
      const secondTarget = document.querySelector('#ConfirmEmail');
      expect(normaliseValidators(input)).toEqual([
          { 
              type: 'equalto',
              message: 'Equalto error message',
              params: {
                'other':  [[firstTarget],[secondTarget]]
              }
          }
      ]);
  });
});


//remote: ['remote-url', 'remote-additionalfields', 'remote-type']//??
describe('Validate > Integration > data-val > remote', () => {
    //validation model construction
    it('should return the correct validation model for remote', async () => {
      document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-remote="Remote error message"
          data-val-remote-url="/api/validate"
          type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            { 
                type: 'remote',
                message: 'Remote error message',
                params: {
                    url: "/api/validate"
                }
            }
        ]);
    });

    it('should return the correct validation model for remote with additional fields', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-remote="Remote error message"
            data-val-remote-url="/api/validate"
            data-val-remote-additionalfields="group2"
            type="text">
            <input
            id="group2"
            name="group2"
            type="text">`;
        const input = document.querySelector('#group1');
        const input2 = [].slice.call(document.querySelectorAll('#group2'));
        expect(normaliseValidators(input)).toEqual([
            { 
                type: 'remote',
                message: 'Remote error message',
                params: {
                    url: "/api/validate",
                    additionalfields: [input2]
                }
            }
        ]);
    });
});

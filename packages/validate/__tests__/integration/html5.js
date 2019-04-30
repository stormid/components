import { normaliseValidators } from '../../src/lib/validator';
import MESSAGES from '../../src/lib/constants/messages';


describe('Validate > Integration > HTML5 > required', () => {
    //validation model construction
  	it('should return the correct validation model for required', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            required
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'required'
            }
		]);
    });
});

describe('Validate > Integration > HTML5 > email', () => {
    //validation model construction
  	it('should return the correct validation model for email', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
			type="email">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'email'
            }
		]);
    });
});

describe('Validate > Integration > HTML5 > url', () => {
    //validation model construction
  	it('should return the correct validation model for url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
			type="url">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'url'
            }
		]);
    });
});

describe('Validate > Integration > HTML5 > number', () => {
    //validation model construction
  	it('should return the correct validation model for number', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
			type="number">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'number'
            }
		]);
    });
});

describe('Validate > Integration > HTML5 > minlength', () => {
    //validation model construction
  	it('should return the correct validation model for minlength', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            minlength="2"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'minlength',
                params: { 
                    min: "2"
                }
            }
		]);
    });
});

describe('Validate > Integration > HTML5 > maxlength', () => {
    //validation model construction
  	it('should return the correct validation model for maxlength', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            maxlength="8"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'maxlength',
                params: { 
                    max: "8"
                }
            }
		]);
    });
});

describe('Validate > Integration > HTML5 > min', () => {
    //validation model construction
  	it('should return the correct validation model for min', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            min="2"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'min',
                params: { 
                    min: "2"
                }
            }
		]);
    });
});

describe('Validate > Integration > HTML5 > max', () => {
    //validation model construction
  	it('should return the correct validation model for max', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            max="8"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'max',
                params: { 
                    max: "8"
                }
            }
		]);
    });
});

describe('Validate > Integration > HTML5 > pattern', () => {
    //validation model construction
  	it('should return the correct validation model for max', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            pattern="[a-z]+$"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'pattern',
                params: { 
                    regex: "[a-z]+$"
                }
            }
		]);
    });
});

/*
    if((input.getAttribute('min') && input.getAttribute('min') !== 'false')){
        validators.push({ type: 'min', params: { min: input.getAttribute('min') } });
    }
    if((input.getAttribute('max') && input.getAttribute('max') !== 'false')){
        validators.push({ type: 'max', params: { max: input.getAttribute('max') } });
    }
    if((input.getAttribute('pattern') && input.getAttribute('pattern') !== 'false')){
        validators.push({ type: 'pattern', params: { regex: input.getAttribute('pattern') } });
    }
    */
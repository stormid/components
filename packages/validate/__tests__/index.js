import Validation from '../src';
import errorMessages from '../src/lib/constants/messages';

const init = () => {
	// Set up our document body
	document.body.innerHTML = `<form method="post" action="">
		<label for="clen">Text (required, min 2 characters, max 8 characters)</label>
		<input id="clen" name="clen" data-val="true" data-val-length="Please enter between 2 and 8 characters"  data-val-required="This field is required" data-val-min="2" data-val-max="8" type="text">
		<span class="text-danger field-validation-valid" data-valmsg-for="clen" data-valmsg-replace="true"></span>
  	</form>`;
};

describe('Initialisation', () => {
	beforeAll(init);
  	it('should return an Object with validate and addMethod functions', async () => {
		const validators = await Validation.init('form');
		expect(validators[0]).not.toBeNull();
	  	expect(validators[0]).not.toBeNull();
	  	expect(validators[0].validate).not.toBeUndefined();
	  	expect(validators[0].addMethod).not.toBeUndefined();
	  	expect(validators[0].getState).not.toBeUndefined();
  });
});

// describe('Validate', () => {
// 	beforeAll(init);
//  	it('should write errors to the dom on validation', async () => {
// 		const validator = Validation.init('form');
// 		validator[0].validate();
// 		console.log(document.getElementById('clen').nextElementSibling.classList);
// 	});
// });
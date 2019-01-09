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
		const validator = await Validation.init('form');
	  	const form = document.querySelector('form');
		expect(window.__validators__).not.toBeNull();
	  	expect(window.__validators__[form]).not.toBeNull();
	  	expect(window.__validators__[form].validate).not.toBeUndefined();
	  	expect(window.__validators__[form].addMethod).not.toBeUndefined();
  });
});

// describe('Validate', () => {
// 	beforeAll(init);
//  	it('should write errors to the dom on validation', async () => {
// 		const validator = Validation.init('form');
// 		const form = document.querySelector('form');
// 		validator[form].validate();
// 		console.log(document.getElementById('clen').nextElementSibling.classList);
// 	});
// });
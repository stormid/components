import { validate, assembleValidationGroup } from '../../src/lib/validator';

describe('Validate > Integration > assembleValidationGroup > required', () => {
    it('should return the validation group for HTML5 required validator', async () => {
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            value=""
            type="text">`;
        const input = document.querySelector('#group1-1');
        const group = [input].reduce(assembleValidationGroup, {});
		expect(group).toEqual({
            'group1': {
                valid:  false,
                validators: [{ type: 'required' }],
                fields: [input],
                serverErrorNode: false
            }
        });
    });
});

describe('Validate > Integration > validate > required', () => {
    it('should return the validityState false for HTML5 required validator with no value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            required
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for HTML5 required validator with a value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            required
            value="Test"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for data-val required validator with no value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val required validator with a value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value="Test"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });
});

describe('Validate > Integration > validate > email', () => {
    //html5 spec regex approximation:
    ///^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    it('should return the validityState false for HTML5 email validator with non-spec email address', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="not.an.email.address"
			type="email">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for HTML5 email validator with an on-spec email address', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="an.email.address@storm"
			type="email">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for data-val email validator with non-spec email address', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-email="Email error message"
            value="not.an.email.address"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val email validator with an on-spec email address', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-email="Email error message"
            value="an.email.address@storm"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});


describe('Validate > Integration > validate > url', () => {
    //html5 spec regex approximation:
    ///^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
    it('should return the validityState false for HTML5 url validator with non-spec url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="not.a.url.com"
			type="url">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for data-val url validator with non-spec url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-url="Not a valid url"
            value="not.a.url.com"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for HTML5 url validator with an on-spec url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="https://a.url.com"
			type="url">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });


    it('should return the validityState false for data-val url validator with non-spec url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-url="Not a valid url"
            value="https://a.url.com"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});
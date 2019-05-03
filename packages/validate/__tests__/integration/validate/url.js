import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validate > url', () => {
    //html5 spec regex approximation:
    ///^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
    it('should return the validityState false for HTML5 url validator with non-spec url', async () => {
        expect.assertions(1);
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
        expect.assertions(1);
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

    it('should return the validityState true for non-required empty HTML5 url validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value=""
			type="url">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for non-required empty data-val url validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-url="Not a valid url"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for HTML5 url validator with an on-spec url', async () => {
        expect.assertions(1);
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
        expect.assertions(1);
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
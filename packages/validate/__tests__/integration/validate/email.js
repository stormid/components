import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validate > email', () => {
    //html5 spec regex approximation:
    ///^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    it('should return the validityState false for HTML5 email validator with non-spec email address', async () => {
        expect.assertions(1);
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
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="an.email.address@storm"
			type="email">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for non-required empty HTML5 email validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value=""
			type="email">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for data-val email validator with non-spec email address', async () => {
        expect.assertions(1);
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
        expect.assertions(1);
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

    it('should return the validityState true for non-required empty data-val email validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
        id="group1"
        name="group1"
        data-val="true"
        data-val-email="Email error message"
            value=""
			type="email">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});
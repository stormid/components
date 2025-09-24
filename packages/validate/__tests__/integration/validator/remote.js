import mock from 'xhr-mock';
import { validate, assembleValidationGroup } from '../../../../src/lib/validator';

describe('Validate > Integration > validator > remote', () => {
    
    beforeEach(() => mock.setup());

    afterEach(() => mock.teardown());

    it('should return the validityState false for data-val remote validator with a failed remote validation', async () => {
        expect.assertions(1);
 
        mock.post('/api/validate', {
            status: 201,
            body: 'false'
        });
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-remote="Remote error message"
            data-val-remote-type="post"
            data-val-remote-url="/api/validate"
            data-val-remote-additionalfields="group2"
            value="Failure"
            type="text">
        <input
            id="group2"
            name="group2"
            value="Value 2"
            type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        const res = await validate(group, group.validators[0]);
        expect(res).toEqual('false');
    });

    it('should return the validityState true for data-val remote validator with a passed remote validation', async () => {
        expect.assertions(1);

        mock.post('/api/validate', {
            status: 201,
            body: 'true'
        });
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-remote="Remote error message"
            data-val-remote-type="post"
            data-val-remote-url="/api/validate"
            data-val-remote-additionalfields="group2"
            value="Pass"
            type="text">
        <input
            id="group2"
            name="group2"
            value="Value 2"
            type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        const res = await validate(group, group.validators[0]);
        expect(res).toEqual('true');
    });
      
});
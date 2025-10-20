import validate from '../../src';

describe('Validate  > Reset', () => {

    it('should clear errors messages from state and DOM, remove error classNames and attributes, remove errors from state', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div>
                <label for="group1">Label</label>
                <input id="group1" name="group1" data-val="true" data-val-required="This field is required" />
            </div>
            <div>
                <label for="group2">Label</label>
                <input id="group2" name="group2" data-val="true" data-val-required="This field is required" />
            </div>
        </form>`;
       
        const [ validator ] = validate('.form');
        await validator.validate();
        expect(validator.getState().groups.group1.valid).toEqual(false);
        expect(validator.getState().groups.group2.valid).toEqual(false);

        validator.getState().form.dispatchEvent(new Event('reset'));
        expect(validator.getState().groups.group1.valid).toEqual(true);
        expect(validator.getState().groups.group2.valid).toEqual(true);
        expect(validator.getState().groups.group1.errorMessages).toEqual([]);
        expect(validator.getState().groups.group2.errorMessages).toEqual([]);
        expect(validator.getState().errors.group1).toBeUndefined();
        expect(validator.getState().errors.group2).toBeUndefined();
    });
});

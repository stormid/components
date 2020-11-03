import validate from '../../../src';

describe('Validate > Integration > Reset', () => {

    it('should clear errors messages from state and DOM, remove error classNames and attributes, remove errorNodes from state', async () => {
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
        // const mockState = {
        //     groups: {
        //         group1: {
        //             fields: Array.from(document.getElementsByName('group1')),
        //             errorMessages: ['This field is required'],
        //             valid: false
        //         },
        //         group2: {
        //             fields: Array.from(document.getElementsByName('group2')),
        //             errorMessages: ['This field is required'],
        //             valid: false
        //         }
        //     },
        //     errorNodes: {
        //         group1: document.getElementById('test-error-node-1'),
        //         group2: document.getElementById('test-error-node-2')
        //     }
        // };
        const [ validator ] = validate('.form');
        //Validate and set errors in state and DOM
        await validator.validate();
        expect(validator.getState().groups.group1.valid).toEqual(false);
        expect(validator.getState().groups.group2.valid).toEqual(false);
        expect(validator.getState().errorNodes.group1).toEqual(document.querySelector('[for="group1"]').lastElementChild);
        expect(validator.getState().errorNodes.group2).toEqual(document.querySelector('[for="group2"]').lastElementChild);
        expect(validator.getState().groups.group1.fields[0].parentNode.classList.contains('is--invalid')).toEqual(true);
        expect(validator.getState().groups.group2.fields[0].parentNode.classList.contains('is--invalid')).toEqual(true);
        expect(validator.getState().groups.group1.fields[0].getAttribute('aria-invalid')).toEqual('true');
        expect(validator.getState().groups.group2.fields[0].getAttribute('aria-invalid')).toEqual('true');

        //reset to remove errors from state and DOM
        validator.getState().form.dispatchEvent(new Event('reset'));
        expect(validator.getState().groups.group1.valid).toEqual(true);
        expect(validator.getState().groups.group2.valid).toEqual(true);
        expect(validator.getState().groups.group1.errorMessages).toEqual([]);
        expect(validator.getState().groups.group2.errorMessages).toEqual([]);
        expect(validator.getState().errorNodes.group1).toBeUndefined();
        expect(validator.getState().errorNodes.group2).toBeUndefined();
        expect(validator.getState().groups.group1.fields[0].parentNode.classList.contains('is--invalid')).toEqual(false);
        expect(validator.getState().groups.group2.fields[0].parentNode.classList.contains('is--invalid')).toEqual(false);
        expect(validator.getState().groups.group1.fields[0].getAttribute('aria-invalid')).toEqual(null);
        expect(validator.getState().groups.group2.fields[0].getAttribute('aria-invalid')).toEqual(null);
    });

});

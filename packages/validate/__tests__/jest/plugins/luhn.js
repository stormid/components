import validate from '../../../src';
import luhn from '../../../src/lib/plugins/methods/luhn';

describe('Validate > Integration > Plugins > Luhn', () => {

    it('should add a validation method to a group', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                required
                type="text" />
        </form>`;
        // const form = document.querySelector('.form');
        const input = document.querySelector('#group1-1');
        const [ validator ] = validate('form');

        expect(validator.getState().groups).toEqual({
            group1: {
                serverErrorNode: false,
                validators: [{ type: 'required' }],
                fields: [input],
                valid: false
            }
        });
        const message = 'Custom error';
        validator.addMethod('group1', luhn, message);

        expect(validator.getState().groups).toEqual({
            group1: {
                serverErrorNode: false,
                validators: [{ type: 'required' }, { type: 'custom', method: luhn, message }],
                fields: [input],
                valid: false
            }
        });
    });

    it('should not validate a clean optional field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                type="text" />
        </form>`;
        const [ validator ] = validate('form');
        const message = 'Custom error';
        validator.addMethod('group1', luhn, message);
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should return false for a malformed credit card number', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value="123456789"
                type="text" />
        </form>`;
        const [ validator ] = validate('form');
        const message = 'Custom error';
        validator.addMethod('group1', luhn, message);
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
    });

    it('should return true for valid credit card numbers', async () => {
        const formats = {
            'American Express': 378282246310005,
            'American Express 2': 371449635398431,
            'American Express Corporate': 378734493671000,
            'Australian BankCard': 5610591081018250,
            'Diners Club': 30569309025904,
            Discover: 6011111111111117,
            'Discover 2': 6011000990139424,
            JCB: 3530111333300000,
            'JCB 2': 3566002020360505,
            MasterCard: 5555555555554444,
            'MasterCard 2': 5105105105105100,
            Visa: 4111111111111111,
            'Visa 2': 4012888888881881
        };
        expect.assertions(Object.values(formats).length);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                required
                type="text" />
        </form>`;
        const [ validator ] = validate('form');
        const field  = document.querySelector('#group1-1');
        const message = 'Custom error';
        validator.addMethod('group1', luhn, message);

        for (let format in formats) {
            field.value = formats[format];
            const validityState = await validator.validate();
            expect(validityState).toEqual(true);
        }
    });

});
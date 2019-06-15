import Methods from '../../../src/lib/validator/methods';

//required
describe('Validate > Unit > Validator > methods > required', () => {

    it('should return false for group containing a single empty field', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="" required /></form>`;
        const group = { fields: [document.querySelector('#field')] };
        expect(Methods.required(group)).toEqual(false);
    });
    
    it('should return false for group  with no value', () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field-1" />
            <input type="checkbox" name="field" id="field-2" />
        </form>`;
        const group = { fields: [document.querySelector('#field-1'), document.querySelector('#field-1')] };
        expect(Methods.required(group)).toEqual(false);
    });

    it('should return false for group containing a single empty field', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="Test" required /></form>`;
        const group = { fields: [document.querySelector('#field')] };
        expect(Methods.required(group)).toEqual(true);
    });
    
    it('should return true for group with value', () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field-1" checked />
            <input type="checkbox" name="field" id="field-2" />
        </form>`;
        const group = { fields: [document.querySelector('#field-1'), document.querySelector('#field-1')] };
        expect(Methods.required(group)).toEqual(true);
    });

});


//email
describe('Validate > Unit > Validator > methods > email', () => {

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="email" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [{ type: 'required' }],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.email(group)).toEqual(false);
    });

    it('should return true for group that is not required', () => {
        document.body.innerHTML = `<form><input type="email" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.email(group)).toEqual(true);
    });
    
    // it('should return false for group  with no value', () => {
    //     document.body.innerHTML = `<form>
    //         <input type="checkbox" name="field" id="field-1" />
    //         <input type="checkbox" name="field" id="field-2" />
    //     </form>`;
    //     const group = { fields: [document.querySelector('#field-1'), document.querySelector('#field-1')] };
    //     expect(Methods.required(group)).toEqual(false);
    // });

    // it('should return false for group containing a single empty field', () => {
    //     document.body.innerHTML = `<form><input name="field" id="field" value="Test" required /></form>`;
    //     const group = { fields: [document.querySelector('#field')] };
    //     expect(Methods.required(group)).toEqual(true);
    // });
    
    // it('should return true for group with value', () => {
    //     document.body.innerHTML = `<form>
    //         <input type="checkbox" name="field" id="field-1" checked />
    //         <input type="checkbox" name="field" id="field-2" />
    //     </form>`;
    //     const group = { fields: [document.querySelector('#field-1'), document.querySelector('#field-1')] };
    //     expect(Methods.required(group)).toEqual(true);
    // });
    
});


//url
//dateISO
//number
//digits
//minlength
//maxlength
//equalto
//pattern
//regex
//min
//max
//stringlength
//length
//range
//remote
//custom
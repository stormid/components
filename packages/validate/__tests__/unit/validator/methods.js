import mock from 'xhr-mock';
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

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="email" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.email(group)).toEqual(true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="email" name="field" id="field" value="no" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.email(group)).toEqual(false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form><input type="email" name="field" id="field" value="me@email" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.email(group)).toEqual(true);
    });

});


//url
describe('Validate > Unit > Validator > methods > url', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="url" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.url(group)).toEqual(true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="url" name="field" id="field" value="no" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.url(group)).toEqual(false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form><input type="url" name="field" id="field" value="https://a.valid.url" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.url(group)).toEqual(true);
    });
    
});

//dateISO
describe('Validate > Unit > Validator > methods > dateISO', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.dateISO(group)).toEqual(true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="12/12/12" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.dateISO(group)).toEqual(false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="2019-05-14" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.dateISO(group)).toEqual(true);
    });
    
});

//number
describe('Validate > Unit > Validator > methods > number', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.number(group)).toEqual(true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="no" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.number(group)).toEqual(false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form>
            <input type="text" name="field1" id="field1" value="100" />
            <input type="text" name="field2" id="field2" value="0.100" />
            <input type="text" name="field3" id="field3" value="-100" />
        </form>`;
        const group1 = {
            validators: [],
            fields: [document.querySelector('#field1')]
        };
        expect(Methods.number(group1)).toEqual(true);
        const group2 = {
            validators: [],
            fields: [document.querySelector('#field2')]
        };
        expect(Methods.number(group2)).toEqual(true);
        const group3 = {
            validators: [],
            fields: [document.querySelector('#field3')]
        };
        expect(Methods.number(group3)).toEqual(true);
    });
    
});


//digits
describe('Validate > Unit > Validator > methods > digits', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.digits(group)).toEqual(true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form>
            <input type="text" name="field" id="field1" value="no" />
            <input type="text" name="field2" id="field2" value="0.100" />
            <input type="text" name="field3" id="field3" value="-100" />
        </form>`;
        const group1 = {
            validators: [],
            fields: [document.querySelector('#field1')]
        };
        expect(Methods.digits(group1)).toEqual(false);
        
        const group2 = {
            validators: [],
            fields: [document.querySelector('#field2')]
        };
        expect(Methods.digits(group2)).toEqual(false);

        const group3 = {
            validators: [],
            fields: [document.querySelector('#field3')]
        };
        expect(Methods.digits(group3)).toEqual(false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form>
            <input type="text" name="field1" id="field1" value="100" />
        </form>`;
        const group1 = {
            validators: [],
            fields: [document.querySelector('#field1')]
        };
        expect(Methods.digits(group1)).toEqual(true);
    });
    
});


//minlength
describe('Validate > Unit > Validator > methods > minlength', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'minlength',
                    params: { min: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.minlength(group)).toEqual(true);
    });

    it('should return false for group with a value < min', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="no" /></form>`;
        const group = {
            validators: [
                {
                    type: 'minlength',
                    params: { min: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.minlength(group)).toEqual(false);
    });

    it('should return true for group with a value => min', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="fine" /></form>`;
        const group = {
            validators: [
                {
                    type: 'minlength',
                    params: { min: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.minlength(group)).toEqual(true);
    });
    
});

//maxlength
describe('Validate > Unit > Validator > methods > maxlength', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'maxlength',
                    params: { max: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.maxlength(group)).toEqual(true);
    });

    it('should return false for group with a value > max', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="not good" /></form>`;
        const group = {
            validators: [
                {
                    type: 'maxlength',
                    params: { max: 5 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.maxlength(group)).toEqual(false);
    });

    it('should return true for group with a value <= max', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="fine" /></form>`;
        const group = {
            validators: [
                {
                    type: 'maxlength',
                    params: { max: 5 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.maxlength(group)).toEqual(true);
    });
    
});

//equalto
describe('Validate > Unit > Validator > methods > equalto', () => {

    it('should return true for groups with no value', () => {
        document.body.innerHTML = `<form>
            <input type="text" name="field1" id="field1" value="" />
            <input type="text" name="field2" id="field2" value="" />
        </form>`;
        const group = {
            validators: [
                {
                    type: 'equalto',
                    params: { other: [[document.querySelector('#field2')]] }
                }
            ],
            fields: [document.querySelector('#field1')]
        };
        expect(Methods.equalto(group)).toEqual(true);
    });

    it('should return false for groups with unequal values', () => {
        document.body.innerHTML = `<form>
            <input type="text" name="field1" id="field1" value="Yes" />
            <input type="text" name="field2" id="field2" value="No" />
        </form>`;
        const group = {
            validators: [
                {
                    type: 'equalto',
                    params: { other: [[document.querySelector('#field2')]] }
                }
            ],
            fields: [document.querySelector('#field1')]
        };
        expect(Methods.equalto(group)).toEqual(false);
    });

    it('should return true for groups with unequal values', () => {
        document.body.innerHTML = `<form>
            <input type="text" name="field1" id="field1" value="Yes" />
            <input type="text" name="field2" id="field2" value="Yes" />
        </form>`;
        const group = {
            validators: [
                {
                    type: 'equalto',
                    params: { other: [[document.querySelector('#field2')]] }
                }
            ],
            fields: [document.querySelector('#field1')]
        };
        expect(Methods.equalto(group)).toEqual(true);
    });
    
});


//pattern
describe('Validate > Unit > Validator > methods > pattern', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'pattern',
                    params: { regex: /^(pass)$/ }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.pattern(group)).toEqual(true);
    });

    it('should return false for group with a non-matching value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="fail" /></form>`;
        const group = {
            validators: [
                {
                    type: 'pattern',
                    params: { regex: /^(pass)$/ }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.pattern(group)).toEqual(false);
    });

    it('should return false for group with a matching value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="pass" /></form>`;
        const group = {
            validators: [
                {
                    type: 'pattern',
                    params: { regex: /^(pass)$/ }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.pattern(group)).toEqual(true);
    });
    
});


//regex
describe('Validate > Unit > Validator > methods > regex', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'regex',
                    params: { pattern: /^(pass)$/ }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.regex(group)).toEqual(true);
    });

    it('should return false for group with a non-matching value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="fail" /></form>`;
        const group = {
            validators: [
                {
                    type: 'regex',
                    params: { pattern: /^(pass)$/ }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.regex(group)).toEqual(false);
    });

    it('should return false for group with a matching value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="pass" /></form>`;
        const group = {
            validators: [
                {
                    type: 'regex',
                    params: { pattern: /^(pass)$/ }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.regex(group)).toEqual(true);
    });
    
});

//min
describe('Validate > Unit > Validator > methods > min', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'min',
                    params: { min: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.min(group)).toEqual(true);
    });

    it('should return false for group with a value < min', () => {
        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="2" /></form>`;
        const group = {
            validators: [
                {
                    type: 'min',
                    params: { min: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.min(group)).toEqual(false);
    });

    it('should return true for group with a value => min', () => {
        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="4" /></form>`;
        const group = {
            validators: [
                {
                    type: 'min',
                    params: { min: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.min(group)).toEqual(true);
    });
    
});

//max
describe('Validate > Unit > Validator > methods > max', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'max',
                    params: { max: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.max(group)).toEqual(true);
    });

    it('should return false for group with a value > max', () => {
        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="5" /></form>`;
        const group = {
            validators: [
                {
                    type: 'max',
                    params: { max: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.max(group)).toEqual(false);
    });

    it('should return true for group with a value <= max', () => {
        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="3" /></form>`;
        const group = {
            validators: [
                {
                    type: 'max',
                    params: { max: 5 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.max(group)).toEqual(true);
    });
    
});


//stringlength
describe('Validate > Unit > Validator > methods > stringlength', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'stringlength',
                    params: { max: 3 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.stringlength(group)).toEqual(true);
    });

    it('should return false for group with a value > max', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="not good" /></form>`;
        const group = {
            validators: [
                {
                    type: 'stringlength',
                    params: { max: 5 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.stringlength(group)).toEqual(false);
    });

    it('should return true for group with a value <= max', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="fine" /></form>`;
        const group = {
            validators: [
                {
                    type: 'stringlength',
                    params: { max: 5 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.stringlength(group)).toEqual(true);
    });
    
});


//length
describe('Validate > Unit > Validator > methods > length', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'length',
                    params: { min: 5, max: 8 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.length(group)).toEqual(true);
    });

    it('should return false for group with a value > max', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="A string that is too long" /></form>`;
        const group = {
            validators: [
                {
                    type: 'length',
                    params: { min: 5, max: 8 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.length(group)).toEqual(false);
    });

    it('should return false for group with a value < min', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="no" /></form>`;
        const group = {
            validators: [
                {
                    type: 'length',
                    params: { min: 5, max: 8 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.length(group)).toEqual(false);
    });

    it('should return true for group with a value >= min and <= max', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="Super" /></form>`;
        const group = {
            validators: [
                {
                    type: 'length',
                    params: { min: 5, max: 8 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.length(group)).toEqual(true);
    });
    
});


//range
describe('Validate > Unit > Validator > methods > range', () => {

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [
                {
                    type: 'range',
                    params: { min: 5, max: 8 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.range(group)).toEqual(true);
    });

    it('should return false for group with a value > max', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="10" /></form>`;
        const group = {
            validators: [
                {
                    type: 'range',
                    params: { min: 5, max: 8 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.range(group)).toEqual(false);
    });

    it('should return false for group with a value < min', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="4" /></form>`;
        const group = {
            validators: [
                {
                    type: 'range',
                    params: { min: 5, max: 8 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.range(group)).toEqual(false);
    });

    it('should return true for group with a value >= min and <= max', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="5" /></form>`;
        const group = {
            validators: [
                {
                    type: 'range',
                    params: { min: 5, max: 8 }
                }
            ],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.range(group)).toEqual(true);
    });
    
});


//remote
describe('Validate > Unit > Validator > methods > remote', () => {

    beforeEach(() => mock.setup());

    afterEach(() => mock.teardown());

    it('should return false for when the remote validation returns "false"', async () => {

        mock.post('/api/validate', {
            status: 201,
            body: "false"
        });

        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        const params = {
            url: '/api/validate'
        };
        const res = await Methods.remote(group, params);
        expect(res).toEqual("false");
    });

    it('should return false for when the remote validation returns "false"', async () => {

        mock.post('/api/validate', {
            status: 201,
            body: "true"
        });

        document.body.innerHTML = `<form><input type="number" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        const params = {
            url: '/api/validate'
        };
        const res = await Methods.remote(group, params);
        expect(res).toEqual("true");
    });


});

//custom
describe('Validate > Unit > Validator > methods > custom', () => {
    const customValidator = (value, fields) => value === 'Contrived validator';

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.custom(customValidator, group)).toEqual(true);
    });
    
    it('should return false when the custom validation function return false', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="No" /></form>`;
        const group = { 
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.custom(customValidator, group)).toEqual(false);
    });
    
    
    it('should return true when the custom validation function return true', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="Contrived validator" /></form>`;
        const group = { 
            validators: [],
            fields: [document.querySelector('#field')]
        };
        expect(Methods.custom(customValidator, group)).toEqual(true);
    });

});
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import xhrMockPkg from 'xhr-mock';
import Methods from '../../src/lib/validator/methods.js';

const xhrMock = xhrMockPkg.default;

describe('Validate > Unit > Validator > methods > required', () => {

    it('should return false for group containing a single empty field', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="" required /></form>`;
        const group = { fields: [document.querySelector('#field')] };
        assert.deepStrictEqual(Methods.required(group), false);
    });
    
    it('should return false for group  with no value', () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field-1" />
            <input type="checkbox" name="field" id="field-2" />
        </form>`;
        const group = { fields: [document.querySelector('#field-1'), document.querySelector('#field-1')] };
        assert.deepStrictEqual(Methods.required(group), false);
    });

    it('should return true for a group with a single required field wuith a value', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="Test" required /></form>`;
        const group = { fields: [document.querySelector('#field')] };
        assert.deepStrictEqual(Methods.required(group), true);
    });
    
    it('should return true for group with value', () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field-1" checked />
            <input type="checkbox" name="field" id="field-2" />
        </form>`;
        const group = { fields: [document.querySelector('#field-1'), document.querySelector('#field-1')] };
        assert.deepStrictEqual(Methods.required(group), true);
    });

});

describe('Validate > Unit > Validator > methods > email', () => {
    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="email" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.email(group), true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="email" name="field" id="field" value="no" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.email(group), false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form><input type="email" name="field" id="field" value="me@email" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.email(group), true);
    });

});

describe('Validate > Unit > Validator > methods > url', () => {
    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="url" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.url(group), true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="url" name="field" id="field" value="no" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.url(group), false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form><input type="url" name="field" id="field" value="https://a.valid.url" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.url(group), true);
    });
    
});

describe('Validate > Unit > Validator > methods > dateISO', () => {
    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.dateISO(group), true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="12/12/12" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.dateISO(group), false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="2019-05-14" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.dateISO(group), true);
    });
    
});

describe('Validate > Unit > Validator > methods > number', () => {
    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.number(group), true);
    });

    it('should return false for group containing a non-spec value', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="no" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.number(group), false);
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
        assert.deepStrictEqual(Methods.number(group1), true);
        const group2 = {
            validators: [],
            fields: [document.querySelector('#field2')]
        };
        assert.deepStrictEqual(Methods.number(group2), true);
        const group3 = {
            validators: [],
            fields: [document.querySelector('#field3')]
        };
        assert.deepStrictEqual(Methods.number(group3), true);
    });
    
});

describe('Validate > Unit > Validator > methods > digits', () => {
    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input type="text" name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.digits(group), true);
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
        assert.deepStrictEqual(Methods.digits(group1), false);
        
        const group2 = {
            validators: [],
            fields: [document.querySelector('#field2')]
        };
        assert.deepStrictEqual(Methods.digits(group2), false);

        const group3 = {
            validators: [],
            fields: [document.querySelector('#field3')]
        };
        assert.deepStrictEqual(Methods.digits(group3), false);
    });

    it('should return true for group containing an on-spec value', () => {
        document.body.innerHTML = `<form>
            <input type="text" name="field1" id="field1" value="100" />
        </form>`;
        const group1 = {
            validators: [],
            fields: [document.querySelector('#field1')]
        };
        assert.deepStrictEqual(Methods.digits(group1), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.minlength(group), true);
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
        assert.deepStrictEqual(Methods.minlength(group), false);
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
        assert.deepStrictEqual(Methods.minlength(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.maxlength(group), true);
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
        assert.deepStrictEqual(Methods.maxlength(group), false);
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
        assert.deepStrictEqual(Methods.maxlength(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.equalto(group), true);
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
        assert.deepStrictEqual(Methods.equalto(group), false);
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
        assert.deepStrictEqual(Methods.equalto(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.pattern(group), true);
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
        assert.deepStrictEqual(Methods.pattern(group), false);
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
        assert.deepStrictEqual(Methods.pattern(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.regex(group), true);
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
        assert.deepStrictEqual(Methods.regex(group), false);
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
        assert.deepStrictEqual(Methods.regex(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.min(group), true);
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
        assert.deepStrictEqual(Methods.min(group), false);
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
        assert.deepStrictEqual(Methods.min(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.max(group), true);
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
        assert.deepStrictEqual(Methods.max(group), false);
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
        assert.deepStrictEqual(Methods.max(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.stringlength(group), true);
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
        assert.deepStrictEqual(Methods.stringlength(group), false);
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
        assert.deepStrictEqual(Methods.stringlength(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.length(group), true);
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
        assert.deepStrictEqual(Methods.length(group), false);
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
        assert.deepStrictEqual(Methods.length(group), false);
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
        assert.deepStrictEqual(Methods.length(group), true);
    });
    
});

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
        assert.deepStrictEqual(Methods.range(group), true);
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
        assert.deepStrictEqual(Methods.range(group), false);
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
        assert.deepStrictEqual(Methods.range(group), false);
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
        assert.deepStrictEqual(Methods.range(group), true);
    });
    
});

describe('Validate > Unit > Validator > methods > remote', () => {
    beforeEach(() => {
        xhrMock.setup();
        globalThis.XMLHttpRequest = window.XMLHttpRequest;
    });
    afterEach(() => {
        xhrMock.teardown();
        globalThis.XMLHttpRequest = window.XMLHttpRequest;
    });

    it('should return false for when the remote validation returns \'false\'', async () => {
        xhrMock.post('/api/validate', {
            status: 201,
            body: 'false'
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
        assert.deepStrictEqual(res, 'false');
    });

    it('should return false for when the remote validation returns "false"', async () => {
        xhrMock.post('/api/validate', {
            status: 201,
            body: 'true'
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
        assert.deepStrictEqual(res, 'true');
    });
});

describe('Validate > Unit > Validator > methods > custom', () => {
    const customValidator = (value, fields) => value === 'Contrived validator';

    it('should return true for group with no value that is not required', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.custom(customValidator, group), true);
    });
    
    it('should return false when the custom validation function return false', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="No" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.custom(customValidator, group), false);
    });
    
    
    it('should return true when the custom validation function return true', () => {
        document.body.innerHTML = `<form><input name="field" id="field" value="Contrived validator" /></form>`;
        const group = {
            validators: [],
            fields: [document.querySelector('#field')]
        };
        assert.deepStrictEqual(Methods.custom(customValidator, group), true);
    });
});
import {
    isCheckable,
    isFile,
    isSelect,
    isSubmitButton,
    hasNameValue,
    isRequired,
    isHidden,
    hasValue,
    groupValueReducer,
    resolveGetParams,
    domNodesFromCommaList,
    escapeAttributeValue,
    extractValueFromGroup,
    findErrors
} from '../../../src/lib/validator/utils';

describe('Validate > Unit > Utils > isCheckable', () => {
    it('should return true if the field is of type radio', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="radio" id="radio" name="radio" />
        </form>`;
        const field = document.getElementById('radio');
        expect(isCheckable(field)).toEqual(true);
    });
    it('should return true if the field is of type checkbox', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" id="checkbox" name="checkbox" />
        </form>`;
        const field = document.getElementById('checkbox');
        expect(isCheckable(field)).toEqual(true);
    });
    it('should return false if the field is not of type radio or checkbox', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="text" id="text" name="text" />
        </form>`;
        const field = document.getElementById('text');
        expect(isCheckable(field)).toEqual(false);
    });
});

describe('Validate > Unit > Utils > isFile', () => {
    it('should return true if the field is of type file', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="file" id="file" name="file" />
        </form>`;
        const field = document.getElementById('file');
        expect(isFile(field)).toEqual(true);
    });
    it('should return false if the field is not of type file', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" id="checkbox" name="checkbox" />
        </form>`;
        const field = document.getElementById('checkbox');
        expect(isFile(field)).toEqual(false);
    });
});

describe('Validate > Unit > Utils > isSelect', () => {
    it('should return true if the field is a select', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <select id="select" name="select">
                <option></option>
            </select>
        </form>`;
        const field = document.getElementById('select');
        expect(isSelect(field)).toEqual(true);
    });
    it('should return false if the field is not a select', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" id="checkbox" name="checkbox" />
        </form>`;
        const field = document.getElementById('checkbox');
        expect(isSelect(field)).toEqual(false);
    });
});

describe('Validate > Unit > Utils > isSubmitButton', () => {
    it('should return true if the node is a button with type of submit', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <button id="btn" type="submit">Submit</button>
        </form>`;
        const node = document.getElementById('btn');
        expect(isSubmitButton(node)).toEqual(true);
    });
    it('should return true if the node is a button', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <button id="btn">Submit</button>
        </form>`;
        const node = document.getElementById('btn');
        expect(isSubmitButton(node)).toEqual(true);
    });
    it('should return false if the node is not a button and not of type submit', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" id="checkbox" name="checkbox" />
        </form>`;
        const field = document.getElementById('checkbox');
        expect(isSubmitButton(field)).toEqual(false);
    });
});

describe('Validate > Unit > Utils > hasNameValue', () => {
    it('should return true if the node has name and value attributes', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input id="field" name="field" value="" />
        </form>`;
        const node = document.getElementById('field');
        expect(hasNameValue(node)).toEqual(true);
    });
    it('should return false if the node has no name attribute', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input id="field" value="" />
        </form>`;
        const node = document.getElementById('field');
        expect(hasNameValue(node)).toEqual(false);
    });
    it('should return false if the node has no value attribute', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input id="field" name="field" />
        </form>`;
        const node = document.getElementById('field');
        expect(hasNameValue(node)).toEqual(false);
    });
});

describe('Validate > Unit > Utils > isRequired', () => {
    it('should return true if the group has a required validator', async () => {
        expect.assertions(1);
        const group = {
            validators: [{ type: 'required', essage: 'Required error message' }]
        };
        expect(isRequired(group)).toEqual(true);
    });
    it('should return false if the group does not contain a required validator', async () => {
        expect.assertions(1);
        const group = {
            validators: [{ type: 'range', essage: 'Range error message', params: { min: '2', max: '8' } }]
        };
        expect(isRequired(group)).toEqual(false);
    });
});

describe('Validate > Unit > Utils > isHidden', () => {
    it('should return true if the field is of type hidden', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input name="fields" id="field-1" type="hidden" />`;
        const field = document.querySelector('#field-1');

        expect(isHidden(field)).toEqual(true);
    });
    it('should return false if the field is not of type hidden', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input name="fields" id="field-1" type="text" />`;
        const field = document.querySelector('#field-1');

        expect(isHidden(field)).toEqual(false);
    });
});

describe('Validate > Unit > Utils > hasValue', () => {
    it('should return true if the field has a non-empty value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Has value" />
        </form>`;
        const field = document.getElementById('field');

        expect(hasValue(field)).toEqual(true);
    });
    it('should return false if the field has an empty value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="" />
        </form>`;
        const field = document.getElementById('field');

        expect(hasValue(field)).toEqual(false);
    });
    it('should return false if the field has no value attribute', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" />
        </form>`;
        const field = document.getElementById('field');

        expect(hasValue(field)).toEqual(false);
    });
});

//groupValueReducer
describe('Validate > Unit > Utils > groupValueReducer', () => {
    it('should return the String value given an input with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('Test value');
    });
    it('should trim String value given an input with a value whitespace', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="   Test value   " />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('Test value');
    });
    it('should return an empty String given an input without a value and an initial empty string', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('');
    });
    it('should return an Array containing a String value given a checkable input with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual(['Test value']);
    });
    it('should return an Array containing a String value given a checkable input with a value and an initial Array', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer([], field)).toEqual(['Test value']);
    });
    it('should return an empty String given a checkable input that is not checked and an initial empty string', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('');
    });
});

// resolveGetParams
describe('Validate > Unit > Utils > resolveGetParams', () => {
    it('should return a url param String name/value pair given an array containing a single array of a single input', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test" />
        </form>`;
        const fields = [document.querySelector('#field')];
        expect(resolveGetParams([fields])).toEqual('field=Test');
    });
    it('should return a url param String name/value pair given an array containing multiple arrays of single inputs', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field1" id="field1" value="One" />
            <input name="field2" id="field2" value="Two" />
        </form>`;
        const field1 = [document.querySelector('#field1')];
        const field2 = [document.querySelector('#field2')];
        expect(resolveGetParams([field1, field2])).toEqual('field1=One&field2=Two');
    });
    it('should return a uri-encoded url param String name/value pair given an array containing multiple arrays of single inputs', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field1" id="field1" value="Test one" />
            <input name="field2" id="field2" value="Test two" />
        </form>`;
        const field1 = [document.querySelector('#field1')];
        const field2 = [document.querySelector('#field2')];
        expect(resolveGetParams([field1, field2])).toEqual('field1=Test%20one&field2=Test%20two');
    });
});

// domNodesFromCommaList
describe('Validate > Unit > Utils > domNodesFromCommaList', () => {
    it('should return an array of arrays of nodes matching each name in a comma separated String', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field1" id="field1" />
            <input name="field2" id="field2" />
        </form>`;
        const field1s = document.querySelector('#field1');
        const field2s = document.querySelector('#field2');
        expect(domNodesFromCommaList('field1,field2')).toEqual([[field1s], [field2s]]);
    });
    it('should return an array of empty arrays for a comma separated String that does not select any node name attributes', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field1" id="field1" />
            <input name="field2" id="field2" />
        </form>`;
        expect(domNodesFromCommaList('field3,field4')).toEqual([[], []]);
    });
});

// escapeAttributeValue
describe('Validate > Unit > Utils > escapeAttributeValue', () => {
    it('should escape special characters matching /([!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~] in a String', async () => {
        expect(escapeAttributeValue('<script>alert("Boo")</script>')).toEqual('\\<script\\>alert\\(\\"Boo\\"\\)\\<\\/script\\>');
    });
});

//getStatePrefix
//appendStatePrefix

//extractValueFromGroup // -> see groupValueReducer
describe('Validate > Unit > Utils > extractValueFromGroup', () => {
    it('should return the String value given a group with a field array containing an input with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const group = { fields: [document.querySelector('#field')] };
        expect(extractValueFromGroup(group)).toEqual('Test value');
    });
    it('should return the String value given a field array containing an input with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const group = [document.querySelector('#field')];
        expect(extractValueFromGroup(group)).toEqual('Test value');
    });
});

//fetch

describe('Validate > Unit > Utils > findErrors', () => {

    it('Should find serverErrorNodes and convert string error messages to DOM nodes', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <label id="test-label" for="group1">Text</label>
            <input id="group1" name="group1" data-val="true" data-val-required="This field is required">
            <span id="test-server-error-node" data-valmsg-for="group1" role="alert">Server-rendered error</span>
        </form>`;
        const serverErrorNode = document.getElementById('test-server-error-node');
        const groups = {
            group1: {
                serverErrorNode,
                fields: Array.from(document.getElementsByName('group1'))
            }
        };
        const errors = findErrors(groups);
        expect(errors.group1).toEqual(serverErrorNode.firstChild);
        expect(errors.group1.nodeType).toEqual(Node.TEXT_NODE);
    });

});
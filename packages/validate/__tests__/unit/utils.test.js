import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
} from '../../src/lib/validator/utils.js';

describe('Validate > Unit > Utils > isCheckable', () => {
    it('should return true if the field is of type radio', async () => {
        document.body.innerHTML = `<form>
            <input type="radio" id="radio" name="radio" />
        </form>`;
        const field = document.getElementById('radio');
        assert.deepStrictEqual(isCheckable(field), true);
    });

    it('should return true if the field is of type checkbox', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" id="checkbox" name="checkbox" />
        </form>`;
        const field = document.getElementById('checkbox');
        assert.deepStrictEqual(isCheckable(field), true);
    });

    it('should return false if the field is not of type radio or checkbox', async () => {
        document.body.innerHTML = `<form>
            <input type="text" id="text" name="text" />
        </form>`;
        const field = document.getElementById('text');
        assert.deepStrictEqual(isCheckable(field), false);
    });
});

describe('Validate > Unit > Utils > isFile', () => {
    it('should return true if the field is of type file', async () => {
        document.body.innerHTML = `<form>
            <input type="file" id="file" name="file" />
        </form>`;
        const field = document.getElementById('file');
        assert.deepStrictEqual(isFile(field), true);
    });

    it('should return false if the field is not of type file', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" id="checkbox" name="checkbox" />
        </form>`;
        const field = document.getElementById('checkbox');
        assert.deepStrictEqual(isFile(field), false);
    });
});

describe('Validate > Unit > Utils > isSelect', () => {
    it('should return true if the field is a select', async () => {
        document.body.innerHTML = `<form>
            <select id="select" name="select">
                <option></option>
            </select>
        </form>`;
        const field = document.getElementById('select');
        assert.deepStrictEqual(isSelect(field), true);
    });

    it('should return false if the field is not a select', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" id="checkbox" name="checkbox" />
        </form>`;
        const field = document.getElementById('checkbox');
        assert.deepStrictEqual(isSelect(field), false);
    });
});

describe('Validate > Unit > Utils > isSubmitButton', () => {
    it('should return true if the node is a button with type of submit', async () => {
        document.body.innerHTML = `<form>
            <button id="btn" type="submit">Submit</button>
        </form>`;
        const node = document.getElementById('btn');
        assert.deepStrictEqual(isSubmitButton(node), true);
    });

    it('should return true if the node is a button', async () => {
        document.body.innerHTML = `<form>
            <button id="btn">Submit</button>
        </form>`;
        const node = document.getElementById('btn');
        assert.deepStrictEqual(isSubmitButton(node), true);
    });

    it('should return false if the node is not a button and not of type submit', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" id="checkbox" name="checkbox" />
        </form>`;
        const field = document.getElementById('checkbox');
        assert.deepStrictEqual(isSubmitButton(field), false);
    });
});

describe('Validate > Unit > Utils > hasNameValue', () => {
    it('should return true if the node has name and value attributes', async () => {
        document.body.innerHTML = `<form>
            <input id="field" name="field" value="" />
        </form>`;
        const node = document.getElementById('field');
        assert.deepStrictEqual(hasNameValue(node), true);
    });

    it('should return false if the node has no name attribute', async () => {
        document.body.innerHTML = `<form>
            <input id="field" value="" />
        </form>`;
        const node = document.getElementById('field');
        assert.deepStrictEqual(hasNameValue(node), false);
    });

    it('should return false if the node has no value attribute', async () => {
        document.body.innerHTML = `<form>
            <input id="field" name="field" />
        </form>`;
        const node = document.getElementById('field');
        assert.deepStrictEqual(hasNameValue(node), false);
    });
});

describe('Validate > Unit > Utils > isRequired', () => {
    it('should return true if the group has a required validator', async () => {
        const group = {
            validators: [{ type: 'required', essage: 'Required error message' }]
        };
        assert.deepStrictEqual(isRequired(group), true);
    });

    it('should return false if the group does not contain a required validator', async () => {
        const group = {
            validators: [{ type: 'range', essage: 'Range error message', params: { min: '2', max: '8' } }]
        };
        assert.deepStrictEqual(isRequired(group), false);
    });
});

describe('Validate > Unit > Utils > isHidden', () => {
    it('should return true if the field is of type hidden', async () => {
        document.body.innerHTML = `<input name="fields" id="field-1" type="hidden" />`;
        const field = document.querySelector('#field-1');

        assert.deepStrictEqual(isHidden(field), true);
    });

    it('should return false if the field is not of type hidden', async () => {
        document.body.innerHTML = `<input name="fields" id="field-1" type="text" />`;
        const field = document.querySelector('#field-1');

        assert.deepStrictEqual(isHidden(field), false);
    });
});

describe('Validate > Unit > Utils > hasValue', () => {
    it('should return true if the field has a non-empty value', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Has value" />
        </form>`;
        const field = document.getElementById('field');

        assert.deepStrictEqual(hasValue(field), true);
    });

    it('should return false if the field has an empty value', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="" />
        </form>`;
        const field = document.getElementById('field');

        assert.deepStrictEqual(hasValue(field), false);
    });

    it('should return false if the field has no value attribute', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" />
        </form>`;
        const field = document.getElementById('field');

        assert.deepStrictEqual(hasValue(field), false);
    });
});

describe('Validate > Unit > Utils > groupValueReducer', () => {
    it('should return the String value given an input with a value', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), 'Test value');
    });

    it('should trim String value given an input with a value whitespace', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="   Test value   " />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), 'Test value');
    });

    it('should return an empty String given an input without a value and an initial empty string', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="" />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), '');
    });

    it('should return an Array containing a String value given a checkable input with a value', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), ['Test value']);
    });

    it('should return an Array containing a String value given a checkable input with a value and an initial Array', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer([], field), ['Test value']);
    });
    
    it('should return an empty String given a checkable input that is not checked and an initial empty string', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), '');
    });
});

describe('Validate > Unit > Utils > resolveGetParams', () => {
    it('should return a url param String name/value pair given an array containing a single array of a single input', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test" />
        </form>`;
        const fields = [document.querySelector('#field')];
        assert.deepStrictEqual(resolveGetParams([fields]), 'field=Test');
    });

    it('should return a url param String name/value pair given an array containing multiple arrays of single inputs', async () => {
        document.body.innerHTML = `<form>
            <input name="field1" id="field1" value="One" />
            <input name="field2" id="field2" value="Two" />
        </form>`;
        const field1 = [document.querySelector('#field1')];
        const field2 = [document.querySelector('#field2')];
        assert.deepStrictEqual(resolveGetParams([field1, field2]), 'field1=One&field2=Two');
    });

    it('should return a uri-encoded url param String name/value pair given an array containing multiple arrays of single inputs', async () => {
        document.body.innerHTML = `<form>
            <input name="field1" id="field1" value="Test one" />
            <input name="field2" id="field2" value="Test two" />
        </form>`;
        const field1 = [document.querySelector('#field1')];
        const field2 = [document.querySelector('#field2')];
        assert.deepStrictEqual(resolveGetParams([field1, field2]), 'field1=Test%20one&field2=Test%20two');
    });
});

describe('Validate > Unit > Utils > domNodesFromCommaList', () => {
    it('should return an array of arrays of nodes matching each name in a comma separated String', async () => {
        document.body.innerHTML = `<form>
            <input name="field1" id="field1" />
            <input name="field2" id="field2" />
        </form>`;
        const field1s = document.querySelector('#field1');
        const field2s = document.querySelector('#field2');
        assert.deepStrictEqual(domNodesFromCommaList('field1,field2'), [[field1s], [field2s]]);
    });

    it('should return an array of empty arrays for a comma separated String that does not select any node name attributes', async () => {
        document.body.innerHTML = `<form>
            <input name="field1" id="field1" />
            <input name="field2" id="field2" />
        </form>`;
        assert.deepStrictEqual(domNodesFromCommaList('field3,field4'), [[], []]);
    });
});

describe('Validate > Unit > Utils > escapeAttributeValue', () => {
    it('should escape special characters matching /([!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~] in a String', async () => {
        assert.deepStrictEqual(escapeAttributeValue('<script>alert("Boo")</script>'), '\\<script\\>alert\\(\\"Boo\\"\\)\\<\\/script\\>');
    });
});

describe('Validate > Unit > Utils > extractValueFromGroup', () => {
    it('should return the String value given a group with a field array containing an input with a value', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const group = { fields: [document.querySelector('#field')] };
        assert.deepStrictEqual(extractValueFromGroup(group), 'Test value');
    });

    it('should return the String value given a field array containing an input with a value', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const group = [document.querySelector('#field')];
        assert.deepStrictEqual(extractValueFromGroup(group), 'Test value');
    });
});

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
        assert.deepStrictEqual(errors.group1, serverErrorNode.textContent);
    });
});
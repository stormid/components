import {
    h,
    clearError,
    clearErrors,
    updateMessageValues
} from '../../../src/lib/dom';
import { DOTNET_CLASSNAMES } from '../../../src/lib/constants';

//clearError
describe('Validate > Unit > DOM > clearError', () => {
    
    it('should delete the errorNode for the group from state', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" data-val="true" data-val-required="This field is required" aria-describedby="test-error-node" />
                <span id="test-error-node" class="field-validation-valid">This field is required</span>
            </div>
        </form>`;
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group1'))
                }
            },
            errors: {
                group1: document.getElementById('test-error-node')
            }
        };
        //all side effects to test
        clearError('group1')(mockState);
        expect(mockState.errors.group1).toBeUndefined();
    });

    
    it('should remove a server-side rendered text node for the group from state', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" data-val="true" data-val-required="This field is required" aria-describedby="test-server-error-node" />
                <span id="test-server-error-node" data-valmsg-for="group1" class="${DOTNET_CLASSNAMES.ERROR}"></span>
            </div>
        </form>`;
        //have to create a text node and append it to the serverError node to test fn this in isolation
        const errorNode = document.createTextNode('This field is required');
        const serverErrorNode = document.getElementById('test-server-error-node');
        serverErrorNode.appendChild(errorNode);
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode,
                    fields: Array.from(document.getElementsByName('group1'))
                }
            },
            errors: {
                group1: errorNode
            }
        };

        clearError('group1')(mockState);
        expect(mockState.errors.group1).toBeUndefined();
    });
});

//clearErrors
describe('Validate > Unit > DOM > clearErrors', () => {
    
    it('Should remove all errors from state for valid groups', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" data-val="true" data-val-required="This field is required" aria-describedby="test-error-node-1" />
                <span id="test-error-node-1" class="field-validation-valid">This field is required</span>
            </div>
            <div class="is--invalid">
                <label for="group2">Label</label>
                <input id="group2" name="group2" aria-invalid="true" data-val="true" data-val-required="This field is required" aria-describedby="test-error-node-2" />
                <span id="test-error-node-2" class="field-validation-valid">This field is required</span>
            </div>
        </form>`;
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group1'))
                },
                group2: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group2'))
                }
            },
            errors: {
                group1: document.getElementById('test-error-node-1'),
                group2: document.getElementById('test-error-node-2')
            }
        };
        clearErrors(mockState);
        expect(mockState.errors.group1).toBeUndefined();
        expect(mockState.errors.group2).toBeUndefined();
    });
    
    it('should not change state if there are no errors', async () => {
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
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group1'))
                },
                group2: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group2'))
                }
            },
            errors: {}
        };
        const copy = Object.assign({}, mockState);
        clearErrors(mockState);
        expect(copy).toEqual(mockState);
    });
});



//updateMessageValues
describe('Validate > Unit > DOM > updateMessageValues', () => {
    
    it('Should return an error message string containing the input value if the {{value}} token is found in the error message', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div>
                <label id="test-label" for="group1">Text</label>
                <input id="group1" name="group1" value="test" data-val="true" type="email" data-val-email="{{value}} is not a valid email address">
            </div>
           
        </form>`;
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group1')),
                    errorMessages: ['{{value}} is not a valid email address'],
                    valid: false
                }
            },
            errors: {}
        };
        let message = updateMessageValues(mockState, 'group1');
        expect(message).toEqual('test is not a valid email address');
        
    });

    it('Should return an error message with a comma delimited string of values if more than one field is in a group', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div>
                <label id="test-label" for="group1">Text</label>
                <input id="group1" name="group1" value="test" data-val="true" data-val-regex="{{value}} are not valid inputs" data-val-regex-pattern="^http(s)?">
            </div>
            <div>
                <label id="test-label2" for="group2">Text</label>
                <input id="group2" name="group1" value="test2" data-val="true" data-val-regex="{{value}} are not valid inputs" data-val-regex-pattern="^http(s)?">
            </div>
        </form>`;
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group1')),
                    errorMessages: ['{{value}} are not valid inputs'],
                    valid: false
                }
            },
            errors: {}
        };
        let message = updateMessageValues(mockState, 'group1');
        expect(message).toEqual('test, test2 are not valid inputs');
        
    });

    it('Should leave the error message unchanged if the {{value}} token is not found', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div>
                <label id="test-label" for="group1">Text</label>
                <input id="group1" name="group1" value="test" data-val="true" data-val-regex="These are not valid inputs" data-val-regex-pattern="^http(s)?">
            </div>
            <div>
                <label id="test-label2" for="group2">Text</label>
                <input id="group2" name="group1" value="test2" data-val="true" data-val-regex="These are not valid inputs" data-val-regex-pattern="^http(s)?">
            </div>
        </form>`;
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group1')),
                    errorMessages: ['These are not valid inputs'],
                    valid: false
                }
            },
            errors: {}
        };
        let message = updateMessageValues(mockState, 'group1');
        expect(message).toEqual('These are not valid inputs');
        
    });

});
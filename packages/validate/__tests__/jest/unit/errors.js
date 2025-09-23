import {
    h,
    clearError,
    clearErrors,
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
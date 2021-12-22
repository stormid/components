import {
    h,
    clearError,
    clearErrors,
    renderError,
    renderErrors
} from '../../../src/lib/dom';
import { DOTNET_CLASSNAMES } from '../../../src/lib/constants';

//clearError
describe('Validate > Unit > DOM > clearError', () => {
    
    it('should remove a client-side rendered errorNode container, remove invalid classNames and aria, and deletes the errorNode for the group from state', async () => {
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
        expect(document.getElementById('test-error-node')).toEqual(null);
        expect(mockState.groups.group1.fields[0].classList.contains('is--invalid')).toEqual(false);
        expect(mockState.groups.group1.fields[0].getAttribute('aria-invalid')).toEqual(null);
        expect(mockState.errors.group1).toBeUndefined();
    });

    it('should remove a server-side rendered text node, toggle serverNode classNames, remove invalid classNames and aria, and deletes the errorNode for the group from state', async () => {
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
        expect(document.getElementById('test-server-error-node').firstElementChild).toEqual(null);
        expect(mockState.groups.group1.fields[0].classList.contains('is--invalid')).toEqual(false);
        expect(mockState.groups.group1.fields[0].getAttribute('aria-invalid')).toEqual(null);
        expect(mockState.groups.group1.serverErrorNode.classList.contains(DOTNET_CLASSNAMES.ERROR)).toEqual(false);
        expect(mockState.groups.group1.serverErrorNode.classList.contains(DOTNET_CLASSNAMES.VALID)).toEqual(true);
        expect(mockState.groups.group1.serverErrorNode.getAttribute('role')).toEqual(null);
        expect(mockState.errors.group1).toBeUndefined();
    });
});

//clearErrors
describe('Validate > Unit > DOM > clearErrors', () => {
    
    it('should all errors and update DOM via clearError for each validation group', async () => {
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
        //all side effects to test
        clearErrors(mockState);
        expect(document.getElementById('test-error-node-1')).toEqual(null);
        expect(mockState.groups.group1.fields[0].classList.contains('is--invalid')).toEqual(false);
        expect(mockState.groups.group1.fields[0].getAttribute('aria-invalid')).toEqual(null);
        expect(mockState.errors.group1).toBeUndefined();
        expect(document.getElementById('test-error-node-2')).toEqual(null);
        expect(mockState.groups.group2.fields[0].classList.contains('is--invalid')).toEqual(false);
        expect(mockState.groups.group2.fields[0].getAttribute('aria-invalid')).toEqual(null);
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
        //all side effects to test
        const copy = Object.assign({}, mockState);
        clearErrors(mockState);
        expect(copy).toEqual(mockState);
    });
});

//renderError
describe('Validate > Unit > DOM > renderError', () => {

    //add error message container client-side
    it('Should add an error message container if there is no serverErrorNode, and attributes to reflect invalidity', async () => {

        document.body.innerHTML = `<form class="form" method="post" action="">
            <label id="test-label" for="group1">Text</label>
            <input id="group1" name="group1" data-val="true" data-val-required="This field is required">
        </form>`;
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group1')),
                    errorMessages: ['This field is required']
                }
            },
            errors: {}
        };
        renderError('group1')(mockState);
        const errorContainer = document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`);
        expect(errorContainer).not.toBeUndefined();
        expect(errorContainer.textContent).toEqual('This field is required');
        expect(errorContainer.id).toEqual('group1-error-message');
        expect(mockState.groups.group1.fields[0].parentNode.classList.contains('is--invalid')).toEqual(true);
        expect(mockState.groups.group1.fields[0].getAttribute('aria-invalid')).toEqual('true');
    });

    //add error to serverErrorNode
    it('Should add an error message text node to a serverErrorNode, and attributes to reflect invalidity', async () => {

        document.body.innerHTML = `<form class="form" method="post" action="">
            <label id="test-label" for="group1">Text</label>
            <input id="group1" name="group1" data-val="true" data-val-required="This field is required" aria-describedby="test-server-error-node">
            <span id="test-server-error-node" data-valmsg-for="group1" role="alert" class="${DOTNET_CLASSNAMES.ERROR}"></span>
        </form>`;
        const serverErrorNode = document.getElementById('test-server-error-node');
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode,
                    fields: Array.from(document.getElementsByName('group1')),
                    errorMessages: ['This field is required']
                }
            },
            errors: {}
        };
        renderError('group1')(mockState);
        expect(serverErrorNode.textContent).toEqual('This field is required');
        expect(serverErrorNode.getAttribute('role')).toEqual('alert');
        expect(mockState.groups.group1.fields[0].parentNode.classList.contains('is--invalid')).toEqual(true);
        expect(mockState.groups.group1.fields[0].getAttribute('aria-invalid')).toEqual('true');
    });

    //remove existing error and add new one
    it('Should remove existing server-side rendered error before adding new one', async () => {

        document.body.innerHTML = `<form class="form" method="post" action="">
            <label id="test-label" for="group1">Text</label>
            <input id="group1" name="group1" data-val="true" data-val-required="This field is required" aria-describedby="test-server-error-node">
            <span id="test-server-error-node" data-valmsg-for="group1" role="alert" class="${DOTNET_CLASSNAMES.ERROR}"></span>
        </form>`;
        //have to create a text node and append it to the serverError node to test fn this in isolation
        const errorNode = document.createTextNode('The server dislikes the valule of this field');
        const serverErrorNode = document.getElementById('test-server-error-node');
        serverErrorNode.appendChild(errorNode);
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode,
                    fields: Array.from(document.getElementsByName('group1')),
                    errorMessages: ['This field is required']
                }
            },
            errors: {
                group1: errorNode
            }
        };
        renderError('group1')(mockState);
        expect(serverErrorNode.textContent).toEqual('This field is required');
        expect(serverErrorNode.getAttribute('role')).toEqual('alert');
        expect(mockState.groups.group1.fields[0].parentNode.classList.contains('is--invalid')).toEqual(true);
        expect(mockState.groups.group1.fields[0].getAttribute('aria-invalid')).toEqual('true');
        expect(mockState.errors.group1).not.toEqual(errorNode);
    });
});

//renderErrors
describe('Validate > Unit > DOM > renderErrors', () => {

    
    it('Should add error messages for every invalid group in state', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div>
                <label id="test-label" for="group1">Text</label>
                <input id="group1" name="group1" data-val="true" data-val-required="This field is required">
            </div>
            <div>
                <label id="test-label" for="group2">Text</label>
                <input id="group2" name="group2" value="Has a value" data-val="true" data-val-required="This field is required">
            </div>
        </form>`;
        const mockState = {
            groups: {
                group1: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group1')),
                    errorMessages: ['This field is required'],
                    valid: false
                },
                group2: {
                    serverErrorNode: false,
                    fields: Array.from(document.getElementsByName('group2')),
                    errorMessages: [],
                    valid: true
                }
            },
            errors: {}
        };
        renderErrors(mockState);
        const errorContainer = document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`);
        expect(errorContainer).not.toBeUndefined();
        expect(errorContainer.id).toEqual('group1-error-message');
        expect(errorContainer.textContent).toEqual('This field is required');
        expect(mockState.groups.group1.fields[0].parentNode.classList.contains('is--invalid')).toEqual(true);
        expect(mockState.groups.group1.fields[0].getAttribute('aria-invalid')).toEqual('true');
        expect(mockState.groups.group2.fields[0].parentNode.classList.contains('is--invalid')).toEqual(false);
        expect(mockState.groups.group2.fields[0].getAttribute('aria-invalid')).toEqual(null);
    });

});
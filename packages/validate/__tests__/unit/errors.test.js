import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    h,
    clearError,
    clearErrors,
    renderError,
} from '../../src/lib/dom/index.js';
import validate from '../../src/index.js';
import { DOTNET_CLASSNAMES } from '../../src/lib/constants/index.js';

describe('Validate > Unit > DOM > clearError', () => {

    it('should remove the client-side error node and invalidity attributes from the DOM', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" data-val="true" data-val-required="This field is required" aria-describedby="group1-error-message" />
                <span id="group1-error-message" class="${DOTNET_CLASSNAMES.ERROR}" role="alert">This field is required</span>
            </div>
        </form>`;
        const mockState = {
            groups: { group1: { serverErrorNode: false, fields: Array.from(document.getElementsByName('group1')) } }
        };
        clearError('group1')(mockState);
        assert.strictEqual(document.getElementById('group1-error-message'), null);
        assert.strictEqual(document.getElementById('group1').hasAttribute('aria-invalid'), false);
    });

    it('should remove aria-describedby entirely when the error id is the only value', async () => {
        document.body.innerHTML = `<form class="form">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" aria-describedby="group1-error-message" />
                <span id="group1-error-message" class="field-validation-valid">This field is required</span>
            </div>
        </form>`;
        const mockState = {
            groups: { group1: { serverErrorNode: false, fields: Array.from(document.getElementsByName('group1')) } }
        };
        clearError('group1')(mockState);
        assert.strictEqual(document.getElementById('group1').hasAttribute('aria-describedby'), false);
    });

    it('should preserve other aria-describedby ids when the error id is last', async () => {
        document.body.innerHTML = `<form class="form">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" aria-describedby="hint-id group1-error-message" />
                <span id="group1-error-message" class="field-validation-valid">This field is required</span>
            </div>
        </form>`;
        const mockState = {
            groups: { group1: { serverErrorNode: false, fields: Array.from(document.getElementsByName('group1')) } }
        };
        clearError('group1')(mockState);
        assert.strictEqual(document.getElementById('group1').getAttribute('aria-describedby'), 'hint-id');
    });

    it('should preserve other aria-describedby ids when the error id is first', async () => {
        document.body.innerHTML = `<form class="form">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" aria-describedby="group1-error-message hint-id" />
                <span id="group1-error-message" class="field-validation-valid">This field is required</span>
            </div>
        </form>`;
        const mockState = {
            groups: { group1: { serverErrorNode: false, fields: Array.from(document.getElementsByName('group1')) } }
        };
        clearError('group1')(mockState);
        assert.strictEqual(document.getElementById('group1').getAttribute('aria-describedby'), 'hint-id');
    });


    it('should empty a server-side rendered error node and mark it valid', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" data-val="true" data-val-required="This field is required" aria-describedby="group1-error-message" />
                <span id="group1-error-message" data-valmsg-for="group1" class="${DOTNET_CLASSNAMES.ERROR}"></span>
            </div>
        </form>`;
        const serverErrorNode = document.getElementById('group1-error-message');
        serverErrorNode.appendChild(document.createTextNode('This field is required'));
        const mockState = {
            groups: { group1: { serverErrorNode, fields: Array.from(document.getElementsByName('group1')) } }
        };

        clearError('group1')(mockState);
        assert.strictEqual(serverErrorNode.textContent, '');
        assert.strictEqual(serverErrorNode.classList.contains(DOTNET_CLASSNAMES.VALID), true);
        assert.strictEqual(serverErrorNode.classList.contains(DOTNET_CLASSNAMES.ERROR), false);
    });
});

describe('Validate > Unit > DOM > cross-instance isolation', () => {

    it('keys the client error id off the field id so two instances sharing a group name do not clobber each other', () => {
        document.body.innerHTML = `<form>
            <div><label for="email-a">Email</label><input id="email-a" name="email" /></div>
        </form>
        <form>
            <div><label for="email-b">Email</label><input id="email-b" name="email" /></div>
        </form>`;

        const stateA = { groups: { email: { serverErrorNode: false, valid: false, errorMessages: ['A required'], fields: [document.getElementById('email-a')] } } };
        const stateB = { groups: { email: { serverErrorNode: false, valid: false, errorMessages: ['B required'], fields: [document.getElementById('email-b')] } } };

        renderError('email')(stateA);
        renderError('email')(stateB);

        // ids are scoped to the field, not a shared `email-error-message`
        assert.ok(document.getElementById('email-a-error-message'), 'instance A error should render with a field-scoped id');
        assert.ok(document.getElementById('email-b-error-message'), 'instance B error should render with a field-scoped id');

        // clearing instance B must leave instance A's error and its aria wiring intact
        clearError('email')(stateB);
        assert.strictEqual(document.getElementById('email-b-error-message'), null);
        assert.ok(document.getElementById('email-a-error-message'), 'instance A error must survive clearing instance B');
        assert.strictEqual(document.getElementById('email-a').getAttribute('aria-describedby'), 'email-a-error-message');
    });

});

describe('Validate > Unit > DOM > clearErrors', () => {

    it('should remove every group\'s rendered client-side error from the DOM', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div class="is--invalid">
                <label for="group1">Label</label>
                <input id="group1" name="group1" aria-invalid="true" aria-describedby="group1-error-message" />
                <span id="group1-error-message" class="${DOTNET_CLASSNAMES.ERROR}">This field is required</span>
            </div>
            <div class="is--invalid">
                <label for="group2">Label</label>
                <input id="group2" name="group2" aria-invalid="true" aria-describedby="group2-error-message" />
                <span id="group2-error-message" class="${DOTNET_CLASSNAMES.ERROR}">This field is required</span>
            </div>
        </form>`;
        const mockState = {
            groups: {
                group1: { serverErrorNode: false, fields: Array.from(document.getElementsByName('group1')) },
                group2: { serverErrorNode: false, fields: Array.from(document.getElementsByName('group2')) }
            }
        };
        clearErrors(mockState);
        assert.strictEqual(document.getElementById('group1-error-message'), null);
        assert.strictEqual(document.getElementById('group2-error-message'), null);
        assert.strictEqual(document.getElementById('group1').hasAttribute('aria-invalid'), false);
        assert.strictEqual(document.getElementById('group2').hasAttribute('aria-invalid'), false);
    });

    it('should be a no-op when there are no rendered errors', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div>
                <label for="group1">Label</label>
                <input id="group1" name="group1" data-val="true" data-val-required="This field is required" />
            </div>
        </form>`;
        const mockState = {
            groups: { group1: { serverErrorNode: false, fields: Array.from(document.getElementsByName('group1')) } }
        };
        clearErrors(mockState);
        assert.strictEqual(document.getElementById('group1').hasAttribute('aria-invalid'), false);
        assert.strictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`), null);
    });
});

describe('Validate > Integration > DOM > error announcement', () => {

    it('should mark a server-rendered error container as a polite live region on init', () => {
        document.body.innerHTML = `<form class="form">
            <label for="group1">Label</label>
            <input id="group1" name="group1" data-val="true" data-val-required="Required" value="" />
            <span data-valmsg-for="group1" class="field-validation-valid"></span>
        </form>`;
        validate('form');
        const node = document.querySelector('[data-valmsg-for="group1"]');
        assert.strictEqual(node.getAttribute('aria-live'), 'polite');
        assert.strictEqual(node.getAttribute('id'), 'group1-error-message');
    });

    it('should not override an author-provided role/aria-live on a server error container', () => {
        document.body.innerHTML = `<form class="form">
            <label for="group1">Label</label>
            <input id="group1" name="group1" data-val="true" data-val-required="Required" value="" />
            <span data-valmsg-for="group1" role="alert" class="field-validation-valid"></span>
        </form>`;
        validate('form');
        const node = document.querySelector('[data-valmsg-for="group1"]');
        assert.strictEqual(node.hasAttribute('aria-live'), false);
        assert.strictEqual(node.getAttribute('role'), 'alert');
    });

    it('should render an inline error span with role="alert" when no server error node exists', async () => {
        document.body.innerHTML = `<form class="form">
            <label for="group1">Label</label>
            <input id="group1" name="group1" data-val="true" data-val-required="Required" value="" />
        </form>`;
        const [ validator ] = validate('form');
        await validator.validate();
        const span = document.getElementById('group1-error-message');
        assert.ok(span);
        assert.strictEqual(span.getAttribute('role'), 'alert');
    });

    it('should expose the displayed message in getState().errors after a failed validate()', async () => {
        document.body.innerHTML = `<form class="form">
            <label for="group1">Label</label>
            <input id="group1" name="group1" data-val="true" data-val-required="Required" value="" />
        </form>`;
        const [ validator ] = validate('form');
        await validator.validate();
        assert.strictEqual(validator.getState().errors.group1, 'Required');
    });
});
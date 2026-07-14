import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import validate from "../../../src/index.js";
import { GROUP_ATTRIBUTE, DOTNET_CLASSNAMES } from "../../../src/lib/constants/index.js";
import defaults from "../../../src/lib/defaults/index.js";

describe("Validate > Integration > API > addGroup", () => {
	it("should add a validation group", async () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const validator = validate("form")[0];

		assert.deepStrictEqual(validator.getState().groups, {});
		input.setAttribute("required", "required");
		validator.addGroup([input]);
		assert.deepStrictEqual(validator.getState().groups, {
			group1: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
		});
	});

	it("should find errors in an added validation group", async () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
			<span id="group1-error-message" class=" error-message" data-valmsg-for="group1">You must enter a value</span>
            <input
                id="group1-1"
                name="group1"
                value=""
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const validator = validate("form")[0];

		assert.deepStrictEqual(validator.getState().groups, {});
		input.setAttribute("required", "required");
		validator.addGroup([input]);
		console.log(validator.getState().errors);
		assert.deepStrictEqual(validator.getState().errors, {
			group1: "You must enter a value",
		});
});

	it("should return leave state unchanged if it cannot add the validation group", async () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const [validator] = validate("form");
		console.warn = mock.fn();

		assert.deepStrictEqual(validator.getState().groups, {});
		validator.addGroup([input]);
		assert.deepStrictEqual(validator.getState().groups, {});
		assert.ok(console.warn.mock.callCount() > 0);
	});
});

describe("Validate > Integration > API > removeGroup", () => {
	it("should remove a validation group", async () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                required
                value=""
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const validator = validate("form")[0];

		assert.deepStrictEqual(validator.getState().groups, {
			group1: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
		});
		input.removeAttribute("required");
		validator.removeGroup("group1");
		assert.deepStrictEqual(validator.getState().groups, {});
	});
});

describe("Validate > Integration > API > validateGroup", () => {
	it("should validate an individual validation group when called", async () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                required
                value=""
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const validator = validate("form")[0];
		await validator.validateGroup("group1");

		assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, defaults.messages.required());

		input.value = "test";
		await validator.validateGroup("group1");
		assert.strictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`), null);
	});
});

describe("Validate > Integration > API > addMethod", () => {
	it("should add a validation method to a group", async () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                required
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const validator = validate("form")[0];

		assert.deepStrictEqual(validator.getState().groups, {
			group1: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
		});
		const method = () => false;
		const message = "Custom error";
		validator.addMethod("group1", method, message);

		assert.deepStrictEqual(validator.getState().groups, {
			group1: {
				serverErrorNode: false,
				validators: [{ type: "required" }, { type: "custom", method, message }],
				fields: [input],
				valid: false,
			},
		});
	});

	it("should not add a validation method if parameters are missing", async () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                required
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const validator = validate("form")[0];
		console.warn = mock.fn();

		assert.deepStrictEqual(validator.getState().groups, {
			group1: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
		});
		const method = () => false;
		const message = "Custom error";

		validator.addMethod(undefined, method, message);
		assert.deepStrictEqual(validator.getState().groups, {
			group1: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
		});
		assert.ok(console.warn.mock.callCount() > 0);
	});

	it("should not add a validation method if fields cannot be found", async () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                data-val-${GROUP_ATTRIBUTE}="groupX"
                value=""
                required
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const validator = validate("form")[0];

		assert.deepStrictEqual(validator.getState().groups, {
			groupX: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
		});
		const method = () => false;
		const message = "Custom error";

		validator.addMethod("neither-name-or-group-name", method, message);
		assert.deepStrictEqual(validator.getState().groups, {
			groupX: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
		});
	});

	it("Should add a validation method when provided an array of fields and a new group name", () => {
		document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                required
                type="text" />
        </form>`;
		const input = document.querySelector("#group1-1");
		const validator = validate("form")[0];

		assert.deepStrictEqual(validator.getState().groups, {
			group1: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
		});
		const method = () => false;
		const message = "Custom error";
		validator.addMethod("CustomGroup", method, message, [input]);

		assert.deepStrictEqual(validator.getState().groups, {
			group1: {
				serverErrorNode: false,
				validators: [{ type: "required" }],
				fields: [input],
				valid: false,
			},
			CustomGroup: {
				serverErrorNode: false,
				validators: [{ type: "custom", method, message }],
				fields: [input],
				valid: false,
			},
		});
	});
});

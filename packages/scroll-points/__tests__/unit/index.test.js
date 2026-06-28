import { describe, it, before, mock } from 'node:test';
import assert from 'node:assert/strict';
import scrollPoints from '../../src/index.js';
import { getSelection } from '../../src/lib/utils.js';

let basic, withCallback;
const init = () => {
	window.IntersectionObserver = mock.fn(function (cb) {
		this.observe = () => {};
		this.entries = [{ isIntersecting: true }];
	});
	globalThis.IntersectionObserver = window.IntersectionObserver;

	// Set up our document body
	document.body.innerHTML = `<div class="js-scroll-point test"></div>
		<div class="js-scroll-point test-2"></div>
		<div class="js-scroll-point-two test-3"></div>`;

	basic = scrollPoints(".js-scroll-point");
	withCallback = scrollPoints(".js-scroll-point-two", {
		callback() {},
	});
};

describe(`Scroll points > Initialisation`, () => {
	before(init);

	it("should return array of length 2", async () => {
		assert.deepStrictEqual(basic.length, 2);
	});

	it("should return undefined if no nodes match the initialisation selector", async () => {
		assert.strictEqual(scrollPoints(".not-found"), undefined);
	});

	it("each array item should be an object with the expected properties", () => {
		assert.notStrictEqual(basic[0], null);
		assert.notStrictEqual(basic[0].node, null);
		assert.notStrictEqual(basic[0].settings, null);
	});

	it("should initialisation with different settings if different options are passed", () => {
		assert.notStrictEqual(basic[0].settings.callback, withCallback[0].settings.callback);
	});
});

describe(`Scroll points > IntersectionObserver > observe`, () => {
	let observe;
	before(() => {
		observe = mock.fn();
		window.IntersectionObserver = mock.fn(function (cb) {
			this.observe = observe;
			this.entries = [{ isIntersecting: true }];
		});
		globalThis.IntersectionObserver = window.IntersectionObserver;
		// Set up our document body
		document.body.innerHTML = `<div class="js-scroll-point test"></div>
                <div class="js-scroll-point test-2"></div>
                <div class="js-scroll-point-two test-3"></div>`;

		basic = scrollPoints(".js-scroll-point");
	});

	it("creates an observer on the node", () => {
		const node = document.querySelector(".js-scroll-point");
		assert.ok(observe.mock.calls.some(c => { try { assert.deepStrictEqual(c.arguments, [node]); return true; } catch { return false; } }));
	});
});

describe("Scroll points > Options", () => {
	it("should be passed in options", () => {
		assert.notStrictEqual(withCallback[0].settings.callback, null);
		assert.deepStrictEqual(basic[0].settings.callback, false);
	});
});

describe("Scroll points > Initialisation > Get Selection", () => {
	const setupDOM = () => {
		// Set up our document body
		document.body.innerHTML = `<div class="js-scroll-point test"></div>`;
	};

	before(setupDOM);

	it("should return an array when passed a DOM element", async () => {
		const scroll = document.querySelector(".js-scroll-point");
		const els = getSelection(scroll);
		assert.strictEqual(els instanceof Array, true);
		assert.deepStrictEqual(els.length, 1);
	});

	it("should return an array when passed a NodeList element", async () => {
		const scroll = document.querySelectorAll(".js-scroll-point");
		const els = getSelection(scroll);
		assert.strictEqual(els instanceof Array, true);
		assert.deepStrictEqual(els.length, 1);
	});

	it("should return an array when passed an array of DOM elements", async () => {
		const scroll = document.querySelector(".js-scroll-point");
		const els = getSelection([scroll]);
		assert.strictEqual(els instanceof Array, true);
		assert.deepStrictEqual(els.length, 1);
	});

	it("should return an array when passed a string", async () => {
		const els = getSelection(".js-scroll-point");
		assert.strictEqual(els instanceof Array, true);
		assert.deepStrictEqual(els.length, 1);
	});
});

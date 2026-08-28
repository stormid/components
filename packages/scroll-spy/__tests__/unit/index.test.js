import { describe, it, before, mock } from 'node:test';
import assert from 'node:assert/strict';
import scrollSpy from '../../src/index.js';
import { getSelection } from '../../src/lib/utils.js';

let basic, withOptions;
const init = () => {
    window.IntersectionObserver = mock.fn(function(cb) {
	  this.observe = () => {};
	  this.entries = [{ isIntersecting: true }];
    });
    globalThis.IntersectionObserver = window.IntersectionObserver;

    // Set up our document body
    document.body.innerHTML = `<header>
            <nav>
                <a class="js-scroll-spy" href="#section1">Section 1</a>
                <a class="js-scroll-spy" href="#section2">Section 2</a>
                <a class="js-scroll-spy" href="#section3">Section 3</a>
                <a class="js-scroll-spy" href="no-hash">No hash</a>
                <a class="js-scroll-spy-two" href="#section4">Section 3</a>
            </nav>
        </header>
        <div class="container">
            <h1>Scroll Spy</h1>
            <h2>Example</h2>
            <p>Scroll down to see the menu to highlight the current section and to see example code.</p>
            <section id="section1">
                Section 1
            </section>
            <section id="section2" style="height:1500px">
                Section 2
            </section>
            <section id="section3" style="height:500px">
                Section 3
            </section>
            <section id="section4" style="height:500px">
                Section 4
            </section>`;

    basic = scrollSpy('.js-scroll-spy');
    withOptions = scrollSpy('.js-scroll-spy-two', { single: false });
};

describe(`Scroll Spy > Initialisation`, () => {

    before(init);

    it('should return undefined if no nodes match the init selector', async () => {
	  assert.strictEqual(scrollSpy('.not-found'), undefined);
    });

    it('should return an object with the expected properties', () => {
        assert.notStrictEqual(basic, null);
        assert.notStrictEqual(basic.getState().spies, null);
        assert.notStrictEqual(basic.getState().settings, null);
        assert.notStrictEqual(basic.getState(), null);
    });

    it('should initialise with different settings if different options are passed', () => {
        assert.strictEqual(basic.getState().settings.single, true);
        assert.strictEqual(withOptions.getState().settings.single, false);
    });

    it('should expose getState and destroy on the instance', () => {
        assert.strictEqual(typeof basic.getState, 'function');
        assert.strictEqual(typeof basic.destroy, 'function');
    });

});

describe('Scroll spy > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        // Set up our document body
    document.body.innerHTML = `<header>
        <nav>
            <a class="js-scroll-spy" href="#section1">Section 1</a>
        </nav>
    </header>
    <div class="container">
        <h1>Scroll Spy</h1>
        <h2>Example</h2>
        <p>Scroll down to see the menu to highlight the current section and to see example code.</p>
        <section id="section1">
            Section 1
        </section>`;
    }

    before(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const scroll = document.querySelector('.js-scroll-spy');
        const els = getSelection(scroll);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const scroll = document.querySelectorAll('.js-scroll-spy');
        const els = getSelection(scroll);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const scroll = document.querySelector('.js-scroll-spy');
        const els = getSelection([scroll]);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-scroll-spy');
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed an HTMLCollection', async () => {
        const scroll = document.getElementsByClassName('js-scroll-spy');
        const els = getSelection(scroll);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an empty array when passed an unsupported value', async () => {
        assert.deepStrictEqual(getSelection(42), []);
        assert.deepStrictEqual(getSelection(null), []);
        assert.deepStrictEqual(getSelection(undefined), []);
        assert.deepStrictEqual(getSelection({}), []);
    });

});

describe(`Scroll Spy > malformed hash`, () => {

    it('does not throw when a spy href has a malformed percent-escape', () => {
        window.IntersectionObserver = mock.fn(function() {
            this.observe = () => {};
            this.disconnect = () => {};
        });
        globalThis.IntersectionObserver = window.IntersectionObserver;

        document.body.innerHTML = `<nav>
                <a class="js-malformed" href="#100%">Bad</a>
                <a class="js-malformed" href="#good">Good</a>
            </nav>
            <section id="100%">Bad target</section>
            <section id="good">Good target</section>`;

        // decodeURIComponent('100%') throws a URIError; findSpies must fall back to the raw id
        // rather than let the whole instance fail to initialise
        assert.doesNotThrow(() => scrollSpy('.js-malformed'));
    });

});

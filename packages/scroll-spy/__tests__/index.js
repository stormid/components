import scrollSpy from '../src';
import { getSelection } from '../src/lib/utils';

let basic, withCallback;
const init = () => {
    window.IntersectionObserver = jest.fn(function(cb) {
	  this.observe = () => {};
	  this.entries = [{ isIntersecting: true }];
    });

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
            </section></div>`;

    basic = scrollSpy('.js-scroll-spy');
    withCallback = scrollSpy('.js-scroll-spy-two', {
	  callback(){
            // this.node.classList.toggle('callback-test');
	  }
    });
};

describe(`Scroll Spy > Initialisation`, () => {

    beforeAll(init);

    it('should return undefined if no nodes match the init selector', async () => {
	  expect(scrollSpy('.not-found')).toEqual(undefined);
    });

    it('should return an object with the expected properties', () => {
        expect(basic).not.toBeNull();
        expect(basic.getState().spies).not.toBeNull();
        expect(basic.getState().settings).not.toBeNull();
        expect(basic.getState()).not.toBeNull();
    });

    it('should initialisation with different settings if different options are passed', () => {
        expect(basic.getState().settings.callback).not.toEqual(withCallback.getState().settings.callback);
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

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const scroll = document.querySelector('.js-scroll-spy');
        const els = getSelection(scroll);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const scroll = document.querySelectorAll('.js-scroll-spy');
        const els = getSelection(scroll);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const scroll = document.querySelector('.js-scroll-spy');
        const els = getSelection([scroll]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-scroll-spy');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});
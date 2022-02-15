import scrollPoints from '../src';
import { getSelection } from '../src/lib/utils';

let basic, withCallback;
const init = () => {
    window.IntersectionObserver = jest.fn(function(cb) {
	  this.observe = () => {};
	  this.entries = [{ isIntersecting: true }];
    });

    // Set up our document body
    document.body.innerHTML = `<div class="js-scroll-point test"></div>
			 <div class="js-scroll-point test-2"></div>
			 <div class="js-scroll-point-two test-3"></div>`;

    basic = scrollPoints('.js-scroll-point');
    withCallback = scrollPoints('.js-scroll-point-two', {
	  callback(){
            // this.node.classList.toggle('callback-test');
	  }
    });
};

describe(`Scroll points > Initialisation`, () => {

    beforeAll(init);

    it('should return array of length 2', async () => {
	  expect(basic.length).toEqual(2);
    });

    it('should return undefined if no nodes match the initialisation selector', async () => {
	  expect(scrollPoints('.not-found')).toEqual(undefined);
    });

    it('each array item should be an object with the expected properties', () => {
        expect(basic[0]).not.toBeNull();
        expect(basic[0].node).not.toBeNull();
        expect(basic[0].settings).not.toBeNull();
    });

    it('should initialisation with different settings if different options are passed', () => {
        expect(basic[0].settings.callback).not.toEqual(withCallback[0].settings.callback);
    });
	

});

describe(`Scroll points > IntersectionObserver > observe`, () => {
    let observe;
    beforeAll(() => {
        observe = jest.fn();
        window.IntersectionObserver = jest.fn(function(cb) {
            this.observe = observe;
            this.entries = [{ isIntersecting: true }];
        });
        // Set up our document body
        document.body.innerHTML = `<div class="js-scroll-point test"></div>
                <div class="js-scroll-point test-2"></div>
                <div class="js-scroll-point-two test-3"></div>`;

        basic = scrollPoints('.js-scroll-point');
    });

    it('creates an observer on the node', () => {
        const node = document.querySelector('.js-scroll-point');
        expect(observe).toBeCalledWith(node);
    });

});

describe('Scroll points > Options', () => {

    it('should be passed in options', () => {
        expect(withCallback[0].settings.callback).not.toBeNull();
        expect(basic[0].settings.callback).toEqual(false);
    });

});

describe('Scroll points > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        // Set up our document body
        document.body.innerHTML = `<div class="js-scroll-point test"></div>`;
    }

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const scroll = document.querySelector('.js-scroll-point');
        const els = getSelection(scroll);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const scroll = document.querySelectorAll('.js-scroll-point');
        const els = getSelection(scroll);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const scroll = document.querySelector('.js-scroll-point');
        const els = getSelection([scroll]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-scroll-point');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});
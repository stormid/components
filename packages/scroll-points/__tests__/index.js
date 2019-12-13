import ScrollPoints from '../src';

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

    basic = ScrollPoints.init('.js-scroll-point');
    withCallback = ScrollPoints.init('.js-scroll-point-two', {
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

    it('should return undefined if no nodes match the init selector', async () => {
	  expect(ScrollPoints.init('.not-found')).toEqual(undefined);
    });

    it('each array item should be an object with the expected properties', () => {
        expect(basic[0]).not.toBeNull();
        expect(basic[0].node).not.toBeNull();
        expect(basic[0].settings).not.toBeNull();
        expect(basic[0].init).not.toBeNull();
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

        basic = ScrollPoints.init('.js-scroll-point');
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
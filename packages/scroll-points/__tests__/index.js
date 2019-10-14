import Component from '../src';

let basic, withCallback;
const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="js-boilerplate test"></div>
             <div class="js-boilerplate test-2"></div>
             <div class="js-boilerplate-two test-3"></div>`;

    basic = Component.init('.js-boilerplate');
    withCallback = Component.init.call(Component, '.js-boilerplate-two', {
      callback(){
        this.node.classList.toggle('callback-test');
      }
    });
};

describe(`Initialisation`, () => {
    
    beforeAll(init);


    it('should return array of length 2', async () => {
      expect(basic.length).toEqual(2);
    });

    it('each array item should be an object with DOMElement, settings, init, and  handleClick properties', () => {

        expect(basic[0]).not.toBeNull();
        expect(basic[0].node).not.toBeNull();
        expect(basic[0].settings).not.toBeNull();
        expect(basic[0].init).not.toBeNull();
        expect(basic[0].handleClick).not.toBeNull();

    });

     it('should initialisation with different settings if different options are passed', () => {

        expect(basic[0].settings.callback).not.toEqual(withCallback[0].settings.callback);
    
    }); 

});

describe('Options', () => {

  it('should be passed in options', () => {
    
    expect(withCallback[0].settings.callback).not.toBeNull();
    expect(basic[0].settings.callback).toBeNull();

  });

});
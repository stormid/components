import Component from '../src';

let basic, withCallback;
const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="js-boilerplate test"></div>
             <div class="js-boilerplate test-2"></div>
             <div class="js-boilerplate-two test-3"></div>
             <div class="js-boilerplate-three test-4"></div>`;

    basic = Component.init('.js-boilerplate');
    withCallback = Component.init.call(Component, '.js-boilerplate-two', {
      callback(){
        this.node.classList.toggle('callback-test');
      }
    });
};

describe(`Boilerplate > Initialisation`, () => {
    
    beforeAll(init);

    it('should return two instances for a selector matching two DOMElements', async () => {
      expect(basic.length).toEqual(2);
    });

    it('should return undefined if no DOMElements are matched', async () => {
      expect(Component.init('.js-unfound')).toEqual(undefined);
    });
  

    it('each instances should be an object with DOMElement, settings, init, and  handleClick properties', () => {

        expect(basic[0]).not.toBeNull();
        expect(basic[0].node).not.toBeNull();
        expect(basic[0].settings).not.toBeNull();
        expect(basic[0].init).not.toBeNull();
        expect(basic[0].handleClick).not.toBeNull();

    });

    it('should attach the handleClick eventListener to DOMElement of each instance with click eventHandler to toggle className', () => {

        basic[0].node.click();
        expect(basic[0].node.classList).toContain('clicked');
        basic[0].node.click();
        expect(basic[0].node.classList).not.toContain('clicked');

    });

     it('should initialisation with different settings if different options are passed', () => {

        expect(basic[0].settings.callback).not.toEqual(withCallback[0].settings.callback);
    
    }); 

});

describe('Boilerplate > Component API', () => {

  it('should trigger the handleClick function toggling the className', () => {

    basic[0].handleClick.call(basic[0].node);
    expect(basic[0].node.classList).toContain('clicked');
    basic[0].handleClick.call(basic[0].node);
    expect(basic[0].node.classList).not.toContain('clicked');

   });

});


describe('Boilerplate > Options', () => {

  it('should be passed in options', () => {
    
    expect(withCallback[0].settings.callback).not.toBeNull();
    expect(basic[0].settings.callback).toBeNull();

  });

});
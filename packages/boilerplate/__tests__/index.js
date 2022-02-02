import component from '../src';

let basic, withCallback;
const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="js-boilerplate test"></div>
             <div class="js-boilerplate test-2"></div>
             <div class="js-boilerplate-two test-3"></div>
             <div class="js-boilerplate-three test-4"></div>`;

    basic = component('.js-boilerplate');
    withCallback = component('.js-boilerplate-two', {
        callback(){
            this.classList.toggle('callback-test');
        }
    });
};

describe(`Boilerplate > Initialisation`, () => {
    
    beforeAll(init);

    it('should return two instances for a selector matching two DOMElements', async () => {
        expect(basic.length).toEqual(2);
    });

    it('should return undefined if no DOMElements are matched', async () => {
        expect(component('.js-unfound')).toEqual(undefined);
    });

    it('each instances should be an object with DOMElement, settings, and  click properties', () => {
        expect(basic[0]).not.toBeNull();
        expect(basic[0].node).not.toBeNull();
        expect(basic[0].settings).not.toBeNull();
        expect(basic[0].click).not.toBeNull();
    });

    it('should attach the click eventListener to DOMElement of each instance with click eventHandler to toggle className', () => {
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

    it('should trigger the click function toggling the className', () => {
        basic[0].click.call(basic[0].node);
        expect(basic[0].node.classList).toContain('clicked');
        basic[0].click.call(basic[0].node);
        expect(basic[0].node.classList).not.toContain('clicked');
    });

});


describe('Boilerplate > Options', () => {

    it('should be passed in options', () => {
        expect(withCallback[0].settings.callback).not.toBeNull();
        expect(basic[0].settings.callback).toBeNull();
    });

    it('should be execute a callback passed in options', () => {
        expect(withCallback[0].node.classList).not.toContain('callback-test');
        withCallback[0].node.click();
        expect(withCallback[0].node.classList).toContain('callback-test');
    });

});

describe('Boilerplate > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<div class="js-boilerplate test"></div>`;
    }

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const boilerplate = document.querySelector('.js-boilerplate');
        const els = getSelection(boilerplate);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const boilerplate = document.querySelectorAll('.js-boilerplate');
        const els = getSelection(boilerplate);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const boilerplate = document.querySelector('.js-boilerplate');
        const els = getSelection([boilerplate]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-boilerplate');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});
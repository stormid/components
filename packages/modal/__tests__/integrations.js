import Modal from '../src';

let ModalSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = ``;

    ModalSet = Modal.init('.js-modal');
};

describe(`Initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
      expect(ModalSet.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(ModalSet[0]).not.toBeNull();
        expect(ModalSet[0].getState).not.toBeNull();
    });

    it('should create instance with different options based on node data-attributes from same init function', () => {
        expect(ModalSet[0].getState().settings.activeIndex).not.toEqual(TabSet[1].getState().settings.activeIndex);
    });

});
/*
describe(`Accessibility`, () => {

    it('should add correct attributes to tabs', async () => {
        expect(TabSet[0].getState().tabs[1].getAttribute('role')).toEqual('tab');
        expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('false');
        expect(TabSet[0].getState().tabs[1].getAttribute('tabindex')).toEqual('-1');
    });

    it('should add correct attributes to panels', async () => {
        expect(TabSet[0].getState().panels[1].getAttribute('aria-labelledby')).toEqual(TabSet[0].getState().tabs[1].getAttribute('id'));
        expect(TabSet[0].getState().panels[1].getAttribute('role')).toEqual('tabpanel');
        expect(TabSet[0].getState().panels[1].getAttribute('hidden')).toEqual('hidden');
        expect(TabSet[0].getState().panels[1].getAttribute('tabindex')).toEqual('-1');
    });

    it('should add keyboard event listener for the enter key to each tab', () => {
        const right = new window.KeyboardEvent('keydown', { keyCode: 39, bubbles: true });
        const left = new window.KeyboardEvent('keydown', { keyCode: 37, bubbles: true });

        TabSet[0].getState().tabs[0].dispatchEvent(right);
        expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');
        TabSet[0].getState().tabs[1].dispatchEvent(left);
        expect(TabSet[0].getState().tabs[0].getAttribute('aria-selected')).toEqual('true');
    });
    
});

describe(`Mouse events`, () => {
    it('should add keyboard event listener for the enter key to each tab', () => {
        const right = new window.KeyboardEvent('keydown', { keyCode: 39, bubbles: true });
        const left = new window.KeyboardEvent('keydown', { keyCode: 37, bubbles: true });

        TabSet[0].getState().tabs[0].dispatchEvent(right);
        expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');
        TabSet[0].getState().tabs[1].dispatchEvent(left);
        expect(TabSet[0].getState().tabs[0].getAttribute('aria-selected')).toEqual('true');
    });

});
*/
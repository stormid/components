import Modal from '../src';

let ModalSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<button class="js-modal-toggle">Open modal</button>
    <div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
        <div class="modal__close js-modal-close js-modal-toggler" aria-label="close">
        </div>
        <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
            <h1 id="modal-label"></h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
            <svg role="button" aria-label="close" tabindex="0" class="modal__close-btn js-modal-toggle" fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
        </div>
    </div>
    
    <button class="js-modal-toggle__2">Open modal</button>
    <div id="modal-2" class="js-modal modal" data-delay="20" data-modal-toggle="js-modal-toggle__2">
        <div class="modal__close js-modal-close js-modal-toggle__2" aria-label="close">
        </div>
        <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label-2">
            <h1 id="modal-label-2"></h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
            <svg role="button" aria-label="close" tabindex="0" class="modal__close-btn js-modal-toggle__2" fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
        </div>
    </div>`;

    ModalSet = Modal.init('.js-modal');
};

describe(`Initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 2', async () => {
      expect(ModalSet.length).toEqual(2);
    });

    it('should return the expected API', () => {
        expect(ModalSet[0]).not.toBeNull();
        expect(ModalSet[0].getState).not.toBeNull();
    });

    it('should create instance with different options based on node data-attributes from same init function', () => {
        expect(ModalSet[0].getState().settings.delay).not.toEqual(ModalSet[1].getState().settings.delay);
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
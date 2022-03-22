import modal from '../src';
import defaults from '../src/lib/defaults';

let ModalSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="container">
            <button class="js-modal-toggle">Open modal</button>
            <div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle" hidden>
                <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
                    <h1 id="modal-label">Test modal</h1>
                    <button data-id="first-focuable-element">Focusable element</button>
                    <input type="text">
                    <button aria-label="close" data-id="last-focuable-element">
                        <svg class="modal__close-btn js-modal-toggle" fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="container">
            <button class="js-modal-toggle__2">Open modal</button>
            <div id="modal-2" class="js-modal modal" data-delay="20" data-modal-toggle="js-modal-toggle__2">
                <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label-2">
                    <h1 id="modal-label-2">Second test modal</h1>
                    <button>Focusable element</button>
                    <input type="text">
                    <input type="text">
                    <button aria-label="close">
                        <svg class="modal__close-btn js-modal-toggle__2" fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>`;

    ModalSet = modal('.js-modal');
};

describe(`Modal > Initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 2', () => {
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


describe(`Modal > Mouse events`, () => {

    beforeAll(init);

    it('should attach the handleClick eventListener to DOMElement click event to toggle modal state', () => {
        ModalSet[0].getState().toggles[0].click();
        expect(Array.from(ModalSet[0].getState().node.classList)).toContain(defaults.onClassName);
        expect(ModalSet[0].getState().node.hasAttribute('hidden')).toEqual(false);
        expect(document.body.firstElementChild).toEqual(ModalSet[0].getState().node);
        Array.from(document.querySelectorAll('.container')).forEach(container => expect(container.getAttribute('aria-hidden')).toEqual('true'));
        expect(document.documentElement.classList.contains('is--modal')).toEqual(true)
        
        ModalSet[0].getState().toggles[0].click();
        expect(Array.from(ModalSet[0].getState().node.classList)).not.toContain(defaults.onClassName);
        expect(ModalSet[0].getState().node.hasAttribute('hidden')).toEqual(true);
        Array.from(document.querySelectorAll('.container')).forEach(container => expect(container.hasAttribute('aria-hidden')).toEqual(false));
        expect(document.documentElement.classList.contains('is--modal')).toEqual(false)
        
    });

});

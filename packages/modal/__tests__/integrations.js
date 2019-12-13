import Modal from '../src';
import defaults from '../src/lib/defaults';

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

    it('should attach the handleClick eventListener to DOMElement click event to toggle documentElement className', () => {
        ModalSet[0].getState().toggles[0].click();
        expect(Array.from(ModalSet[0].getState().node.classList)).toContain(defaults.onClassName);
        ModalSet[0].getState().toggles[0].click();
        expect(Array.from(ModalSet[0].getState().node.classList)).not.toContain(defaults.onClassName);
    });

});

describe(`Modal > Keyboard events`, () => {

    beforeAll(init);

    it('should attach the keydown eventListener to DOMElement to toggle documentElement className for space bar', () => {
        const space = new window.KeyboardEvent('keydown', { keyCode: 32, bubbles: true });
        ModalSet[0].getState().toggles[0].dispatchEvent(space);
        expect(Array.from(ModalSet[0].getState().node.classList)).toContain(defaults.onClassName);
        ModalSet[0].getState().toggles[0].dispatchEvent(space);
        expect(Array.from(ModalSet[0].getState().node.classList)).not.toContain(defaults.onClassName);
    });
    
    it('should attach the keydown eventListener to DOMElement to toggle documentElement className for enter key', () => {
        const enter = new window.KeyboardEvent('keydown', { keyCode: 13, bubbles: true });
        ModalSet[0].getState().toggles[0].dispatchEvent(enter);
        expect(Array.from(ModalSet[0].getState().node.classList)).toContain(defaults.onClassName);
        ModalSet[0].getState().toggles[0].dispatchEvent(enter);
        expect(Array.from(ModalSet[0].getState().node.classList)).not.toContain(defaults.onClassName);
    });
    
    it('should attach the keydown eventListener to DOMElement to close modal on escape key press', () => {
        const enter = new window.KeyboardEvent('keydown', { keyCode: 13, bubbles: true });
        const escape = new window.KeyboardEvent('keydown', { keyCode: 27, bubbles: true });

        ModalSet[0].getState().toggles[0].dispatchEvent(enter);
        expect(Array.from(ModalSet[0].getState().node.classList)).toContain(defaults.onClassName);
        document.dispatchEvent(escape);
        expect(Array.from(ModalSet[0].getState().node.classList)).not.toContain(defaults.onClassName);
    });

    // tab events not changing activeElement in JSDOM
    // it('should trap tab in the modal until it is closed', () => {
    //     const tab = new window.KeyboardEvent('keydown', { keyCode: 9, bubbles: true });
    //     const enter = new window.KeyboardEvent('keydown', { keyCode: 13, bubbles: true });

    // 	ModalSet[0].getState().toggles[0].dispatchEvent(enter);
    //     // expect(Array.from(ModalSet[0].getState().node.classList)).toContain(defaults.onClassName);
    // 	// document.dispatchEvent(tab);
    //     // document.dispatchEvent(tab);
    //     console.log(document.activeElement.innerHTML);
    //     // expect(Array.from(ModalSet[0].getState().node.classList)).not.toContain(defaults.onClassName);
    // });

});
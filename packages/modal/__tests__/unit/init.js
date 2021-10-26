import modal from '../../src';

let ModalSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<button class="js-modal-toggle">Open modal</button>
    <div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
        <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
            <h1 id="modal-label">Modal</h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
            <button aria-label="close" class="modal__close-btn js-modal-toggle" >
                <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </button>
        </div>
    </div>
    
    <button class="js-modal-toggle__2">Open modal</button>
    <div id="modal-2" class="js-modal-error modal" data-delay="20" data-modal-toggle="js-modal-toggle__2">
        <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label-2">
            <h1 id="modal-label-2">Modal two</h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
             <button aria-label="close" class="modal__close-btn js-modal-toggle-2">
                <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </button>
        </div>
    </div>
    
    <div id="modal-2" class="js-modal modal" data-delay="20" data-modal-toggle="js-modal-toggle__3">
        <div class="modal__inner">
            <h1 id="modal-label-2">Modal three</h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
        </div>
    </div>`;

    ModalSet = modal('.js-modal');
    
};


describe(`Modal > Initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
        expect(ModalSet.length).toEqual(2);
    });

    it('should return the expected API', () => {
        expect(ModalSet[0]).not.toBeNull();
        expect(ModalSet[0].getState).not.toBeNull();
    });

    it('should return without throwing if no DOM nodes are found', () => {
        expect(modal('.js-not-found')).toBeUndefined();
    });

    it('should create instance with different options based on node data-attributes from same init function', () => {
        expect(ModalSet[0].getState().settings.delay).not.toEqual(ModalSet[1].getState().settings.delay);
    });

    it('should set an hidden attribute on the node', () => {
        expect(ModalSet[0].getState().node.getAttribute('hidden')).toEqual('hidden');
    });

    it('should find toggles associated with the modal', () => {
        expect(ModalSet[0].getState().toggles.length).toEqual(2);
    });

});


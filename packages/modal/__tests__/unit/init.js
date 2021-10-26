import modal from '../../src';

let ModalSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<button class="js-modal-toggle" data-id="toggle-1">Open modal</button>
    <div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
        <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
            <h1 id="modal-label">Modal</h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
            <button aria-label="close" class="modal__close-btn js-modal-toggle" data-id="toggle-2">
                <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </button>
        </div>
    </div>
    
    <button class="js-modal-toggle__2">Open modal</button>
    <div id="modal-2" class="js-modal modal" data-delay="20" data-modal-toggle="js-modal-toggle__2">
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
    
    <div id="modal-3" class="js-modal__dialogless modal" data-delay="20" data-modal-toggle="js-modal-toggle__3">
        <div class="modal__inner">
            <h1 id="modal-label-2">Modal three</h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
        </div>
    </div>

    <button class="js-modal-toggle__4">Open modal</button>
    <div id="modal-4" class="js-modal__unlabelled modal" data-modal-toggle="js-modal-toggle__4">
        <div class="modal__inner" role="dialog" aria-modal="true">
            <div class="modal__inner">
                <h1>Modal four</h1>
                <button>Focusable element</button>
                <input type="text">
                <input type="text">
            </div>
        </div>
    </div>`;

    ModalSet = modal('.js-modal');
    
};


describe(`Modal > Initialisation`, () => {
    
    beforeAll(init);

    it('should initialise multiple modals and return an Array of instances', async () => {
        expect(ModalSet.length).toEqual(2);
    });

    it('should return the expected API', () => {
        expect(ModalSet[0]).not.toBeNull();
        expect(ModalSet[0].getState).not.toBeNull();
    });

    it('should return without throwing and a console warning if no DOM nodes are found', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        expect(modal('.js-not-found')).toBeUndefined();
        expect(warn).toHaveBeenCalledWith(`Modal not initialised, no elements found for selector '.js-not-found'`);
        warn.mockRestore();
    });

    it('should return without throwing and a console warning if no dialog is found', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        modal('.js-modal__unlabelled');
        expect(warn).toHaveBeenCalledWith('The modal dialog should have an aria-labelledby attribute that matches the id of an element that contains text, or an aria-label attribute.');
        warn.mockRestore();
    });

    it('should console.warn if the dialog is not labelled with an aria-label or heading that is linked with aria-labelledby', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        expect(modal('.js-not-found')).toBeUndefined();
        expect(warn).toHaveBeenCalledWith(`Modal not initialised, no elements found for selector '.js-not-found'`);
        warn.mockRestore();
    });

    it('should create instance with different options based on node data-attributes from same init function', () => {
        expect(ModalSet[0].getState().settings.delay).not.toEqual(ModalSet[1].getState().settings.delay);
    });

    it('should set a hidden attribute on the node', () => {
        expect(ModalSet[0].getState().node.getAttribute('hidden')).toEqual('hidden');
    });

    it('should find toggles associated with the modal', () => {
        const [ modal ] = ModalSet;
        const { toggles } = modal.getState();
        expect(toggles.length).toEqual(2);
        expect(toggles[0].getAttribute('data-id')).toEqual('toggle-1');
        expect(toggles[1].getAttribute('data-id')).toEqual('toggle-2');
    });

});


import Modal from '../../src';

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
    </div>`;

    ModalSet = Modal.init('.js-modal');
    
};


describe(`Init`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
      expect(ModalSet.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(ModalSet[0]).not.toBeNull();
    });

});

import Modal from '../../src';

let ModalSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = ``;

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

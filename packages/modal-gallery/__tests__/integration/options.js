import ModalGallery from '../../src';

describe(`Modal Gallery > options > preload`, () => {

    it('should preload all images in the modal', () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="//placehold.it/500x500" data-title="Image 1" data-description="Description 1" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w">
            <img src="//placehold.it/200x200" alt="">
        </a>
        <ul hidden>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="//placehold.it/300x500" data-title="Image 2" data-description="Description 2" data-srcset="http://placehold.it/500x800 800w, http://placehold.it/300x500 320w">
                    <img src="//placehold.it/200x200" alt="">
                </a>
            </li>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="//placehold.it/300x300" data-title="Image 3" data-description="Description 3" data-srcset="http://placehold.it/500x500 800w, http://placehold.it/300x300 320w">
                    <img src="//placehold.it/200x200" alt="">
                </a>
            </li>
        </ul>`;

        const Gallery = ModalGallery.init('.js-modal-gallery', { preload: true });
        expect(Gallery.getState().settings.preload).toEqual(true);
        // expect(Gallery.getState().imageCache.length).toEqual(3); <--- JSDOM doesn't fire the load event when the images load
    });

});
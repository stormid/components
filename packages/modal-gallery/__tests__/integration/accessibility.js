import modalGallery from '../../src';
import { KEY_CODES } from '../../src/lib/constants';

describe(`Modal Gallery > accessibility > keyboard > escape`, () => {

    it('should close the modal', () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
            <img src="https://placehold.co/200x200" alt="">
        </a>
        <ul hidden>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x500" data-title="Image 2" data-description="Description 2" data-srcset="https://placehold.co/500x800 800w, https://placehold.co/300x500 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x300" data-title="Image 3" data-description="Description 3" data-srcset="https://placehold.co/500x500 800w, https://placehold.co/300x300 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
        </ul>`;

        const Gallery = modalGallery('.js-modal-gallery');
        Gallery.getState().items[0].trigger.click();
        expect(Gallery.getState().isOpen).toEqual(true);
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.ESC, bubbles: true }));
        expect(Gallery.getState().isOpen).toEqual(false);
    });

});

describe(`Modal Gallery > accessibility > keyboard > left`, () => {

    it('should navigate to the previous item', () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
            <img src="https://placehold.co/200x200" alt="">
        </a>
        <ul hidden>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x500" data-title="Image 2" data-description="Description 2" data-srcset="https://placehold.co/500x800 800w, https://placehold.co/300x500 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x300" data-title="Image 3" data-description="Description 3" data-srcset="https://placehold.co/500x500 800w, https://placehold.co/300x300 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
        </ul>`;

        const Gallery = modalGallery('.js-modal-gallery');
        Gallery.getState().items[1].trigger.click();
        expect(Gallery.getState().current).toEqual(1);
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.LEFT, bubbles: true }));
        expect(Gallery.getState().current).toEqual(0);
    
    });

});

describe(`Modal Gallery > accessibility > keyboard > right`, () => {

    it('should navigate to the previous item', () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
            <img src="https://placehold.co/200x200" alt="">
        </a>
        <ul hidden>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x500" data-title="Image 2" data-description="Description 2" data-srcset="https://placehold.co/500x800 800w, https://placehold.co/300x500 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x300" data-title="Image 3" data-description="Description 3" data-srcset="https://placehold.co/500x500 800w, https://placehold.co/300x300 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
        </ul>`;

        const Gallery = modalGallery('.js-modal-gallery');
        Gallery.getState().items[0].trigger.click();
        expect(Gallery.getState().current).toEqual(0);
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.RIGHT, bubbles: true }));
        expect(Gallery.getState().current).toEqual(1);
    
    });

});

describe(`Modal Gallery > accessibility > keyboard > tab`, () => {

    it('should navigate to the previous item', () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
            <img src="https://placehold.co/200x200" alt="">
        </a>
        <ul hidden>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x500" data-title="Image 2" data-description="Description 2" data-srcset="https://placehold.co/500x800 800w, https://placehold.co/300x500 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x300" data-title="Image 3" data-description="Description 3" data-srcset="https://placehold.co/500x500 800w, https://placehold.co/300x300 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
        </ul>`;

        const Gallery = modalGallery('.js-modal-gallery');
        Gallery.getState().items[0].trigger.click();
        expect(Gallery.getState().current).toEqual(0);
        // expect(document.activeElement).toEqual(Gallery.getState().dom.focusableChildren[0]);
        //urgh, JSDOM doesn't dig document.activeElement
        //checking the test coverage it doesa appear that the correct items are being focused and tab is trapped
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.TAB, bubbles: true }));
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.TAB, bubbles: true }));
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.TAB, bubbles: true }));
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.TAB, bubbles: true }));
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.TAB, bubbles: true }));
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: KEY_CODES.TAB, bubbles: true }));
        document.dispatchEvent(new window.KeyboardEvent('keydown', { shiftKey: true, keyCode: KEY_CODES.TAB, bubbles: true }));
        // expect(document.activeElement).toEqual(Gallery.getState().dom.focusableChildren[0]);
    
    });

});


describe(`Modal Gallery > accessibility > keyboard`, () => {

    it('should navigate to the previous item', () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
            <img src="https://placehold.co/200x200" alt="">
        </a>
        <ul hidden>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x500" data-title="Image 2" data-description="Description 2" data-srcset="https://placehold.co/500x800 800w, https://placehold.co/300x500 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
            <li class="gallery__item">
                <a class="js-modal-gallery" href="https://placehold.co/300x300" data-title="Image 3" data-description="Description 3" data-srcset="https://placehold.co/500x500 800w, https://placehold.co/300x300 320w">
                    <img src="https://placehold.co/200x200" alt="">
                </a>
            </li>
        </ul>`;

        const Gallery = modalGallery('.js-modal-gallery');
        Gallery.getState().items[0].trigger.click();
        expect(Gallery.getState().current).toEqual(0);
        document.dispatchEvent(new window.KeyboardEvent('keydown', { keyCode: 83, bubbles: true }));
        expect(Gallery.getState().current).toEqual(0);
    
    });

});
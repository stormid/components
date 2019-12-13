import ModalGallery from '../../src';
import { initUI, next, previous, close } from '../../src/lib/dom';
import { createStore } from '../../src/lib/store';
import defaults from '../../src/lib/defaults/';

describe(`Modal Gallery > DOM > initUI`, () => {

    it('should add create the modal UI, update the state with references to the rendered dom elements, and toggle the UI state', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [{  src: 'https://placehold.it/500x500' }],
            keyListener: jest.fn()
        });
        initUI(Store)(Store.getState());
        const overlay = document.querySelector('.js-modal-gallery__inner');
        const domItems = [].slice.call(overlay.querySelectorAll('.js-modal-gallery__item'));
        expect(overlay).not.toBeNull();
        expect(Store.getState().dom.overlay.classList.contains('is--active')).toEqual(true);
        expect(Store.getState().dom.overlay.getAttribute('aria-hidden')).toEqual('false');
        expect(domItems).not.toBeNull();
        expect(domItems.length).toEqual(1);
    });
    
});

describe(`Modal Gallery > DOM > next`, () => {
    
    it('should navigate to the next item', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());
        next(Store);

        expect(Store.getState().current).toEqual(1);
        expect(Store.getState().dom.items[0].classList.contains('is--active')).toEqual(false);
        expect(Store.getState().dom.items[1].classList.contains('is--active')).toEqual(true);

    });

    it('should navigate to the first item if on the last', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 2,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());
        next(Store);

        expect(Store.getState().current).toEqual(0);
        expect(Store.getState().dom.items[2].classList.contains('is--active')).toEqual(false);
        expect(Store.getState().dom.items[0].classList.contains('is--active')).toEqual(true);

    });
});


describe(`Modal Gallery > DOM > previous`, () => {
    
    it('should navigate to the next item', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 1,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());
        previous(Store);

        expect(Store.getState().current).toEqual(0);
        expect(Store.getState().dom.items[1].classList.contains('is--active')).toEqual(false);
        expect(Store.getState().dom.items[0].classList.contains('is--active')).toEqual(true);

    });

    it('should navigate to the last item if on the first', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());
        previous(Store);

        expect(Store.getState().current).toEqual(2);
        expect(Store.getState().dom.items[0].classList.contains('is--active')).toEqual(false);
        expect(Store.getState().dom.items[2].classList.contains('is--active')).toEqual(true);

    });
});


describe(`Modal Gallery > DOM > close`, () => {
    
    it('should close the modal and update the state', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 1,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());
        expect(Store.getState().current).toEqual(1);
        expect(Store.getState().dom.items[1].classList.contains('is--active')).toEqual(true);

        close(Store);
        const overlay = document.querySelector('.js-modal-gallery__inner');
        expect(overlay).toBeNull();
        expect(Store.getState().isOpen).toEqual(false);
        expect(Store.getState().current).toEqual(null);

    });

});

describe(`Modal Gallery > accessibility > buttons`, () => {

    it('should navigate to the previous item on previous button press', () => {
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

        const Gallery = ModalGallery.init('.js-modal-gallery');
        Gallery.getState().items[1].trigger.click();
        expect(Gallery.getState().current).toEqual(1);
        Gallery.getState().dom.overlay.querySelector('.js-modal-gallery__previous').click();
        expect(Gallery.getState().current).toEqual(0);
    
    });


    it('should navigate to the next item on next button press', () => {
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

        const Gallery = ModalGallery.init('.js-modal-gallery');
        Gallery.getState().items[0].trigger.click();
        expect(Gallery.getState().current).toEqual(0);
        Gallery.getState().dom.overlay.querySelector('.js-modal-gallery__next').click();
        expect(Gallery.getState().current).toEqual(1);
    
    });
});
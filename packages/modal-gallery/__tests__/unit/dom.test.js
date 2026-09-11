import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import modalGallery from '../../src/index.js';
import { initUI, next, previous, close } from '../../src/lib/dom.js';
import { createStore } from '../../src/lib/store.js';
import defaults from '../../src/lib/defaults/index.js';

describe(`Modal Gallery > DOM > initUI`, () => {

    it('should add create the modal UI, update the state with references to the rendered dom elements, and toggle the UI state', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [{  src: 'https:https://placehold.co/500x500' }],
            keyListener: mock.fn()
        });
        initUI(Store)(Store.getState());
        const overlay = document.querySelector('.js-modal-gallery__inner');
        const domItems = [].slice.call(overlay.querySelectorAll('.js-modal-gallery__item'));
        assert.notStrictEqual(overlay, null);
        assert.deepStrictEqual(Store.getState().dom.overlay.classList.contains('is--active'), true);
        assert.deepStrictEqual(Store.getState().dom.overlay.getAttribute('aria-hidden'), 'false');
        assert.notStrictEqual(domItems, null);
        assert.deepStrictEqual(domItems.length, 1);
    });

});

describe(`Modal Gallery > DOM > next`, () => {

    it('should navigate to the next item', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' }
            ],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        next(Store);

        assert.deepStrictEqual(Store.getState().current, 1);
        assert.deepStrictEqual(Store.getState().dom.items[0].classList.contains('is--active'), false);
        assert.deepStrictEqual(Store.getState().dom.items[1].classList.contains('is--active'), true);

    });

    it('should navigate to the first item if on the last', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 2,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' }
            ],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        next(Store);

        assert.deepStrictEqual(Store.getState().current, 0);
        assert.deepStrictEqual(Store.getState().dom.items[2].classList.contains('is--active'), false);
        assert.deepStrictEqual(Store.getState().dom.items[0].classList.contains('is--active'), true);

    });
});


describe(`Modal Gallery > DOM > previous`, () => {

    it('should navigate to the next item', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 1,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' }
            ],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        previous(Store);

        assert.deepStrictEqual(Store.getState().current, 0);
        assert.deepStrictEqual(Store.getState().dom.items[1].classList.contains('is--active'), false);
        assert.deepStrictEqual(Store.getState().dom.items[0].classList.contains('is--active'), true);

    });

    it('should navigate to the last item if on the first', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' }
            ],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        previous(Store);

        assert.deepStrictEqual(Store.getState().current, 2);
        assert.deepStrictEqual(Store.getState().dom.items[0].classList.contains('is--active'), false);
        assert.deepStrictEqual(Store.getState().dom.items[2].classList.contains('is--active'), true);

    });
});


describe(`Modal Gallery > DOM > close`, () => {

    it('should close the modal and update the state', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 1,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' },
                { src: 'https:https://placehold.co/500x500' }
            ],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        assert.deepStrictEqual(Store.getState().current, 1);
        assert.deepStrictEqual(Store.getState().dom.items[1].classList.contains('is--active'), true);

        close(Store);
        const overlay = document.querySelector('.js-modal-gallery__inner');
        assert.strictEqual(overlay, null);
        assert.deepStrictEqual(Store.getState().isOpen, false);
        assert.deepStrictEqual(Store.getState().current, null);

    });

});

describe(`Modal Gallery > accessibility > buttons`, () => {

    it('should navigate to the previous item on previous button press', () => {
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
        assert.deepStrictEqual(Gallery.getState().current, 1);
        Gallery.getState().dom.overlay.querySelector('.js-modal-gallery__previous').click();
        assert.deepStrictEqual(Gallery.getState().current, 0);

    });


    it('should navigate to the next item on next button press', () => {
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
        assert.deepStrictEqual(Gallery.getState().current, 0);
        Gallery.getState().dom.overlay.querySelector('.js-modal-gallery__next').click();
        assert.deepStrictEqual(Gallery.getState().current, 1);

    });
});

describe(`Modal Gallery > DOM > image rendering`, () => {

    it('should render srcset and sizes from the item model onto the image', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [{}], // one cached entry === one item, so load() paints from cache
            items: [{
                src: 'https://placehold.co/500x500',
                title: 'Image 1',
                srcset: 'https://placehold.co/800x800 800w, https://placehold.co/500x500 320w',
                sizes: '(max-width: 320px) 280px, 800px'
            }],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        const img = document.querySelector('.modal-gallery__img');
        assert.notStrictEqual(img, null);
        assert.strictEqual(img.getAttribute('srcset'), 'https://placehold.co/800x800 800w, https://placehold.co/500x500 320w');
        assert.strictEqual(img.getAttribute('sizes'), '(max-width: 320px) 280px, 800px');
    });

    it('should escape attribute values so a crafted title cannot inject markup', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [{}],
            items: [{ src: 'https://placehold.co/500x500', title: '" onerror="alert(1)', srcset: null, sizes: null }],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        const img = document.querySelector('.modal-gallery__img');
        assert.notStrictEqual(img, null);
        assert.strictEqual(img.hasAttribute('onerror'), false);
        assert.strictEqual(img.getAttribute('alt'), '" onerror="alert(1)');
    });

    it('should paint cached slides that have no img yet (reopen / preload scenario)', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        const imageCache = [];
        imageCache[0] = {};
        imageCache[2] = {}; // indices 0 and 2 cached, 1 not — so load() falls through to loadImages()
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache,
            items: [
                { src: 'https://placehold.co/1', title: 'A' },
                { src: 'https://placehold.co/2', title: 'B' },
                { src: 'https://placehold.co/3', title: 'C' }
            ],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        assert.notStrictEqual(Store.getState().dom.items[0].querySelector('.modal-gallery__img'), null);
        assert.notStrictEqual(Store.getState().dom.items[2].querySelector('.modal-gallery__img'), null);
    });

});

describe(`Modal Gallery > DOM > modal background`, () => {

    const setup = () => {
        document.body.innerHTML = `<main id="bg">background content</main>`;
        document.body.style.overflow = '';
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [{ src: 'https://placehold.co/500x500', title: 'A' }],
            keyListener: mock.fn()
        });
        return Store;
    };

    it('should lock body scroll on open and restore it on close', () => {
        const Store = setup();
        initUI(Store)(Store.getState());
        assert.strictEqual(document.body.style.overflow, 'hidden');
        close(Store);
        assert.strictEqual(document.body.style.overflow, '');
    });

    it('should mark background siblings inert on open and clear them on close', () => {
        const Store = setup();
        initUI(Store)(Store.getState());
        assert.strictEqual(document.getElementById('bg').hasAttribute('inert'), true);
        close(Store);
        assert.strictEqual(document.getElementById('bg').hasAttribute('inert'), false);
    });

});

describe(`Modal Gallery > DOM > status region`, () => {

    it('should announce the current position and title, and update on navigation', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.update({
            ...Store.getState(),
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.co/1', title: 'A' },
                { src: 'https://placehold.co/2', title: 'B' }
            ],
            keyListener: mock.fn()
        });

        initUI(Store)(Store.getState());
        assert.strictEqual(Store.getState().dom.status.textContent, 'Image 1 of 2, A');
        next(Store);
        assert.strictEqual(Store.getState().dom.status.textContent, 'Image 2 of 2, B');
    });

});

import modalGallery from '../../src';
import { getSelection} from '../../src/lib/init'

describe(`Modal Gallery > Initialisation > gallery`, () => {

    it('should return an Object when passed a DOM selector matching links', async () => {
		 document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w" data-sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px">
			<img src="https://placehold.co/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 2" data-description="Description 2" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w" data-sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px">
			<img src="https://placehold.co/200x200" alt="">
		</a>`;
        const gallery = modalGallery('.js-modal-gallery');
        expect(gallery).not.toBeUndefined();
        expect(gallery.getState).not.toBeUndefined();
        expect(gallery.getState().items.length).toEqual(2);
        expect(gallery.getState().isOpen).toEqual(false);
        expect(gallery.getState().current).toEqual(null);
    });

    it('should return undefined when passed a DOM selector that does not match links', async () => {
        expect(modalGallery('.js-not-found')).toBeUndefined();
    });
	
    it('should return undefined when passed a zero-length selector or node array', async () => {
        expect(modalGallery('')).toBeUndefined();
    });

    it('should return an Object with minimal possible options when passed a DOM selector matching links', async () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500">
			<img src="https://placehold.co/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="https://placehold.co/500x500">
			<img src="https://placehold.co/200x200" alt="">
		</a>`;
        const gallery = modalGallery('.js-modal-gallery');
        expect(gallery).not.toBeUndefined();
        expect(gallery.getState).not.toBeUndefined();
        expect(gallery.getState().items.length).toEqual(2);
        expect(gallery.getState().isOpen).toEqual(false);
        expect(gallery.getState().current).toEqual(null);
    });

});

describe(`Modal Gallery > Initisation > single`, () => {

    it('should return an array of Objects when passed a DOM selector matching links when initialising as single images', async () => {
		 document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
			<img src="https://placehold.co/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 2" data-description="Description 2" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
			<img src="https://placehold.co/200x200" alt="">
		</a>`;
        const gallery = modalGallery('.js-modal-gallery', { single: true });
        expect(gallery).not.toBeUndefined();
        expect(gallery.length).toEqual(2);
    });

    it('should return undefined when passed a DOM selector that does not match links', async () => {
        expect(modalGallery('.js-not-found', { single: true })).toBeUndefined();
    });

    it('should return an Object with minimal possible options when passed a DOM selector matching links', async () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500">
			<img src="https://placehold.co/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="https://placehold.co/500x500">
			<img src="https://placehold.co/200x200" alt="">
		</a>`;
        const gallery = modalGallery('.js-modal-gallery', { single: true });
        expect(gallery).not.toBeUndefined();
        expect(gallery.length).toEqual(2);
    });

});


describe(`Modal Gallery > Initialisation > gallery from code`, () => {

    it('should return an Object when passed a DOM selector matching links', async () => {
		 document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
			<img src="https://placehold.co/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 2" data-description="Description 2" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
			<img src="https://placehold.co/200x200" alt="">
		</a>`;
        const els = Array.from(document.querySelectorAll('.js-modal-gallery'));
        const items = els.map(el => ({
            trigger: el,
            src: el.href,
            srcset: el.getAttribute('data-srcset') || null,
            sizes: el.getAttribute('data-sizes') || null,
            title: el.getAttribute('data-title') || '',
            description: el.getAttribute('data-description') || ''
        }));
        
        const gallery = modalGallery(items);
        expect(gallery).not.toBeUndefined();
        expect(gallery.getState).not.toBeUndefined();
        expect(gallery.getState().items.length).toEqual(2);
        expect(gallery.getState().isOpen).toEqual(false);
        expect(gallery.getState().current).toEqual(null);
    });

});

describe('Modal gallery > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="https://placehold.co/500x500" data-title="Image 1" data-description="Description 1" data-srcset="https://placehold.co/800x800 800w, https://placehold.co/500x500 320w">
            <img src="https://placehold.co/200x200" alt="">
        </a>`;
    }

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const modal = document.querySelector('.js-modal-gallery');
        const els = getSelection(modal);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const modal = document.querySelectorAll('.js-modal-gallery');
        const els = getSelection(modal);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const modal = document.querySelector('.js-modal-gallery');
        const els = getSelection([modal]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-modal-gallery');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});
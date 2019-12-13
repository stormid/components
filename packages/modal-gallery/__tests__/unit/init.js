import ModalGallery from '../../src';

describe(`Modal Gallery > Init > gallery`, () => {

    it('should return an Object when passed a DOM selector matching links', async () => {
		 document.body.innerHTML = `<a class="js-modal-gallery" href="//placehold.it/500x500" data-title="Image 1" data-description="Description 1" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w" data-sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px">
			<img src="//placehold.it/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="//placehold.it/500x500" data-title="Image 2" data-description="Description 2" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w" data-sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px">
			<img src="//placehold.it/200x200" alt="">
		</a>`;
        const gallery = ModalGallery.init('.js-modal-gallery');
        expect(gallery).not.toBeUndefined();
        expect(gallery.getState).not.toBeUndefined();
        expect(gallery.getState().items.length).toEqual(2);
        expect(gallery.getState().isOpen).toEqual(false);
        expect(gallery.getState().current).toEqual(null);
    });

    it('should return undefined when passed a DOM selector gthat does not match links', async () => {
        expect(ModalGallery.init('.js-not-found')).toBeUndefined();
    });
	
    it('should return undefined when passed a zero-length selector or node array', async () => {
        expect(ModalGallery.init('')).toBeUndefined();
    });

    it('should return an Object with minimal possible options when passed a DOM selector matching links', async () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="//placehold.it/500x500">
			<img src="//placehold.it/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="//placehold.it/500x500">
			<img src="//placehold.it/200x200" alt="">
		</a>`;
        const gallery = ModalGallery.init('.js-modal-gallery');
        expect(gallery).not.toBeUndefined();
        expect(gallery.getState).not.toBeUndefined();
        expect(gallery.getState().items.length).toEqual(2);
        expect(gallery.getState().isOpen).toEqual(false);
        expect(gallery.getState().current).toEqual(null);
    });

});

describe(`Modal Gallery > Init > single`, () => {

    it('should return an array of Objects when passed a DOM selector matching links when initialising as single images', async () => {
		 document.body.innerHTML = `<a class="js-modal-gallery" href="//placehold.it/500x500" data-title="Image 1" data-description="Description 1" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w">
			<img src="//placehold.it/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="//placehold.it/500x500" data-title="Image 2" data-description="Description 2" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w">
			<img src="//placehold.it/200x200" alt="">
		</a>`;
        const gallery = ModalGallery.init('.js-modal-gallery', { single: true });
        expect(gallery).not.toBeUndefined();
        expect(gallery.length).toEqual(2);
    });

    it('should return undefined when passed a DOM selector gthat does not match links', async () => {
        expect(ModalGallery.init('.js-not-found', { single: true })).toBeUndefined();
    });

    it('should return an Object with minimal possible options when passed a DOM selector matching links', async () => {
        document.body.innerHTML = `<a class="js-modal-gallery" href="//placehold.it/500x500">
			<img src="//placehold.it/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="//placehold.it/500x500">
			<img src="//placehold.it/200x200" alt="">
		</a>`;
        const gallery = ModalGallery.init('.js-modal-gallery', { single: true });
        expect(gallery).not.toBeUndefined();
        expect(gallery.length).toEqual(2);
    });
	

});


describe(`Modal Gallery > Init > gallery from code`, () => {

    it('should return an Object when passed a DOM selector matching links', async () => {
		 document.body.innerHTML = `<a class="js-modal-gallery" href="//placehold.it/500x500" data-title="Image 1" data-description="Description 1" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w">
			<img src="//placehold.it/200x200" alt="">
		</a>
		<a class="js-modal-gallery" href="//placehold.it/500x500" data-title="Image 2" data-description="Description 2" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w">
			<img src="//placehold.it/200x200" alt="">
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

        const gallery = ModalGallery.init(items);
        expect(gallery).not.toBeUndefined();
        expect(gallery.getState).not.toBeUndefined();
        expect(gallery.getState().items.length).toEqual(2);
        expect(gallery.getState().isOpen).toEqual(false);
        expect(gallery.getState().current).toEqual(null);
    });

});


/*
return {
				srcset: el.getAttribute('data-srcset') || null,
				sizes: el.getAttribute('data-sizes') || null,
				title: el.getAttribute('data-title') || '',
				description: el.getAttribute('data-description') || ''
			};
			*/
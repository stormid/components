import gallery from '../src';
import defaults from '../src/lib/defaults';
import { ATTRIBUTE } from '../src/lib/constants';
const flushPromises = () => new Promise(setImmediate);

describe('Gallery > preload', () => {
    //mock image complete because JSDom cannot load images
    beforeAll(() => {
        Object.defineProperty(Image.prototype, 'complete', {
            get() {
                return true;
            }
        });
    });

    it('Should preload all images', async () => {
        document.body.innerHTML = `<section class="gallery js-gallery">
                <h2 class="visually-hidden">Gallery</h2>
                <div class="gallery__header">
                    <div class="gallery__total" aria-live="polite" aria-atomic="true" data-gallery-total>1 of 5</div>
                    <button class="gallery__fullscreen" aria-label="Full screen" data-gallery-fullscreen>
                        <svg class="gallery__fullscreen-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
                    </button>
                </div>
                <div class="gallery__main">
                    <button class="gallery__previous" aria-label="Previous image" data-gallery-previous>
                        <svg class="gallery__previous-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/></g></svg>
                    </button>
                    <ul class="gallery__list">
                        <li
                            class="gallery__item"
                            data-gallery-item
                            data-gallery-item-src="http://placehold.it/800x800"
                            aria-hidden="true"
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <img 
                                    alt="Image one"
                                    class="gallery__item-img"
                                    decoding="async"
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                                />
                            </div>
                            <div class="gallery__item-footer">
                                <div class="gallery__item-meta">
                                    <div class="gallery__item-description">
                                        <h2 class="gallery__item-artist">Kate Murphy</h2>
                                        <div class="gallery__item-category">Architecture - March</div>
                                        <div class="gallery__item-title">Example project name here</div>
                                    </div>
                                    <ul class="gallery__item-tags">
                                        <li class="gallery__item-tag">Example tag</li>
                                        <li class="gallery__item-tag">Example tag</li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li
                            class="gallery__item"
                            data-gallery-item
                            data-gallery-item-src="http://placehold.it/1200x1200"
                            aria-hidden="true"
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <img 
                                    alt="Image two"
                                    class="gallery__item-img"
                                    decoding="async"
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                                />
                            </div>
                            <div class="gallery__item-footer">
                                <div class="gallery__item-meta">
                                    <div class="gallery__item-description">
                                        <h2 class="gallery__item-artist">Kate Murphy</h2>
                                        <div class="gallery__item-category">Architecture - April</div>
                                        <div class="gallery__item-title">Example project name here</div>
                                    </div>
                                    <ul class="gallery__item-tags">
                                        <li class="gallery__item-tag">Example tag</li>
                                        <li class="gallery__item-tag">Example tag</li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <button class="gallery__previous" aria-label="Next image" data-gallery-next>
                        <svg class="gallery__previous-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12"/></g></svg>
                    </button>
                </div>
            </section>`;
        const [ instance ] = gallery('.js-gallery', { preload: true });
        await flushPromises();

        const { items } = instance.getState();

        items.forEach(item => {
            expect(item.node.hasAttribute(ATTRIBUTE.LOADED)).toEqual(true);
            expect(item.img.src).toEqual(item.node.getAttribute(ATTRIBUTE.SRC));
        });
    });

});
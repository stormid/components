import gallery from '../src';
const flushPromises = () => new Promise(setImmediate);
let instance;

beforeAll(() => {
    //mock image complete because JSDom cannot load images
    Object.defineProperty(Image.prototype, 'complete', {
        get() {
            return true;
        }
    });

    document.body.innerHTML = `<section class="gallery js-gallery" id="gallery">
                <h2 class="visually-hidden">Gallery</h2>
                <div class="gallery__header">
                    <div class="gallery__total" aria-live="polite" aria-atomic="true" data-gallery-live-region>1 of 5</div>
                    <button class="gallery__fullscreen" aria-label="Full screen" data-gallery-fullscreen>
                        <svg class="gallery__fullscreen-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
                    </button>
                </div>
                <div class="gallery__main">
                    <button class="gallery__previous" aria-label="Previous image" disabled data-gallery-previous>
                        <svg class="gallery__previous-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/></g></svg>
                    </button>
                    <ul class="gallery__list">
                        <li
                            class="gallery__item"
                            data-gallery-item
                            data-gallery-item-src="https://via.placeholder.com/500x200.png"
                            data-gallery-item-sources='[{ "srcset": "https://via.placeholder.com/700x200.png", "media": "(min-width:400px)" }, { "srcset": "https://via.placeholder.com/1000x200.png", "media": "(min-width:700px)" }, { "srcset": "https://via.placeholder.com/1600x200.jpg", "media": "(min-width:1000px)" }]'
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <div data-gallery-item-loader>Loading...</div>
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
                            data-gallery-item-src="https://via.placeholder.com/420x300.png"
                            data-gallery-item-sources='[{ "srcset": "https://via.placeholder.com/710x200.png", "media": "(min-width:400px)" }, { "srcset": "https://via.placeholder.com/1100x200.png", "media": "(min-width:710px)" }, { "srcset": "https://via.placeholder.com/1600x200.jpg", "media": "(min-width:1100px)" }]'
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <div data-gallery-item-loader>Loading...</div>
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
                        <li
                            class="gallery__item"
                            data-gallery-item
                            data-gallery-item-src="https://via.placeholder.com/430x300.png"
                            data-gallery-item-sources='[{ "srcset": "https://via.placeholder.com/730x200.png", "media": "(min-width:430px)" }, { "srcset": "https://via.placeholder.com/1300x200.png", "media": "(min-width:730px)" }, { "srcset": "https://via.placeholder.com/1630x200.jpg", "media": "(min-width:1300px)"}]'
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <div data-gallery-item-loader>Loading...</div>
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
    [ instance ] = gallery('.js-gallery');
});

describe('Gallery > picture loading', () => {

    it('should create a picture element and add sources', async () => {

        await flushPromises();
        const { items } = instance.getState();
        items.forEach((item, i) => {
            expect(item.loaded).toEqual(true);
            const picture = item.node.querySelector('picture');
            expect(picture).toBeDefined();
            const sources = Array.from(picture.querySelectorAll('source'));
            expect(sources.length).toEqual(item.sources.length);
            const img = picture.querySelector('img');
            
            expect(item.img).toEqual(img);
        });

    });

});
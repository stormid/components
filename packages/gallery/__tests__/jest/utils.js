import { sanitise, getIndexFromURL, getSelection, throttle, patchIds } from '../../src/lib/utils';

describe('Gallery > Utils > sanitize', () => {

    it('should replace ampersands with HTML entity', () => {
        expect(sanitise('test&test&test&test')).toEqual('test&amp;test&amp;test&amp;test');
    });

    it('should replace code block open braces with HTML entity less than', () => {
        expect(sanitise('<test')).toEqual('&lt;test');
    });

    it('should replace code close open braces with HTML entity greater than', () => {
        expect(sanitise('test>')).toEqual('test&gt;');
    });

    it('should replace ampersands, open, and close blocks with non-JS executable HTML entities', () => {
        expect(sanitise('<img src="x" onerror="alert(1)" >Image alert')).toEqual('&lt;img src="x" onerror="alert(1)" &gt;Image alert');
    });

});

describe('Gallery > getIndexFromURL', () => {

    it('Should return fallback if no hash', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL([], '');
        expect(result).toEqual(false);
        warn.mockRestore();
    });
    
    it('Should return fallback if hash does not contain gallery item id', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL([], '#potato');
        expect(result).toEqual(false);
        warn.mockRestore();
    });

    it('Should return index if one is found', () => {
        const result = getIndexFromURL([
            { id: 'gallery-1-1' },
            { id: 'gallery-1-2' }], '#gallery-1-2');

        expect(result).toEqual(1);
    });

    it('Should return fallback passed as argument if no item matching hash', () => {
        const result = getIndexFromURL([], '#gallery-1-2', 'fallback');

        expect(result).toEqual('fallback');
    });


});


describe('Gallery > Utils > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<div class="js-gallery test"></div>`;
    };

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const node = document.querySelector('.js-gallery');
        const els = getSelection(node);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const node = document.querySelectorAll('.js-gallery');
        const els = getSelection(node);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const node = document.querySelector('.js-gallery');
        const els = getSelection([node]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-gallery');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});


describe('Gallery > Utils > Throttle', () => {
    jest.useFakeTimers();
    let mockFn;
    let throttledFn;

    beforeEach(() => {
        mockFn = jest.fn();
        throttledFn = throttle(mockFn, 1000); // 1-second boundary
    });

    it('should call the function immediately on the first invocation', () => {
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should not call the function again within the boundary time', () => {
        throttledFn();
        throttledFn();
        jest.advanceTimersByTime(500); // Half the boundary time
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should call the function again after the boundary time', () => {
        throttledFn();
        jest.advanceTimersByTime(1001); // Full boundary time plus 1
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid consecutive calls correctly', () => {
        throttledFn();
        throttledFn();
        throttledFn();
        jest.advanceTimersByTime(1001);
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should reset the timer after each valid call', () => {
        throttledFn();
        jest.advanceTimersByTime(1001);
        throttledFn();
        jest.advanceTimersByTime(1001);
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(3);
    });
});


describe('Gallery > Utils > patchIds', () => {

    it('should respect authored item ids, but warn if duplicate', () => {

        document.body.innerHTML = `
            <div id="first" />
            <div role="region" class="gallery js-gallery" id="gallery">
                <h2 class="visually-hidden">Gallery</h2>
                <div class="gallery__header">
                    <div class="gallery__total" aria-live="polite" aria-atomic="true" data-gallery-live-region>1 of 5</div>
                    <button class="gallery__fullscreen" aria-label="Full screen" data-gallery-fullscreen>
                        <svg class="gallery__fullscreen-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
                    </button>
                </div>
                <div class="gallery__main">
                    <button class="gallery__previous" aria-label="Previous image" data-gallery-previous>
                        <svg class="gallery__previous-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/></g></svg>
                    </button>
                    <ul class="gallery__list" data-gallery-list>
                        <li
                            class="gallery__item"
                            data-gallery-item
                            id="first"
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <img 
                                    alt="Image one"
                                    class="gallery__item-img"
                                    decoding="async"
                                    src="http://placehold.it/800x800"
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
                            id="second"
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
            </div>`;

        console.warn = jest.fn();
        const items = Array.from(document.querySelectorAll('.gallery__item'));
        patchIds(items, 0);
        expect(console.warn).toHaveBeenCalledWith('Gallery item id "first" is not unique, please ensure each gallery item has a unique id');

    });

    it('should auto-generate ids on items that are missing them', () => {
        document.body.innerHTML = `
            <div role="region" class="gallery js-gallery" id="gallery">
                <h2 class="visually-hidden">Gallery</h2>
                <div class="gallery__header">
                    <div class="gallery__total" aria-live="polite" aria-atomic="true" data-gallery-live-region>1 of 5</div>
                    <button class="gallery__fullscreen" aria-label="Full screen" data-gallery-fullscreen>
                        <svg class="gallery__fullscreen-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
                    </button>
                </div>
                <div class="gallery__main">
                    <button class="gallery__previous" aria-label="Previous image" data-gallery-previous>
                        <svg class="gallery__previous-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/></g></svg>
                    </button>
                    <ul class="gallery__list" data-gallery-list>
                        <li
                            class="gallery__item"
                            data-gallery-item
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <img 
                                    alt="Image one"
                                    class="gallery__item-img"
                                    decoding="async"
                                    src="http://placehold.it/800x800"
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
            </div>`;

        const items = Array.from(document.querySelectorAll('.gallery__item'));
        patchIds(items, 0);
        expect(items[0].id).toEqual('gallery-1-1');
        expect(items[1].id).toEqual('gallery-1-2');

    });

    it('should auto-generate ids on items that are missing them, managing uniqueness across multiple invocations', () => {
        document.body.innerHTML = `
            <div role="region" class="gallery js-gallery" id="gallery">
                <h2 class="visually-hidden">Gallery</h2>
                <div class="gallery__header">
                    <div class="gallery__total" aria-live="polite" aria-atomic="true" data-gallery-live-region>1 of 5</div>
                    <button class="gallery__fullscreen" aria-label="Full screen" data-gallery-fullscreen>
                        <svg class="gallery__fullscreen-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
                    </button>
                </div>
                <div class="gallery__main">
                    <button class="gallery__previous" aria-label="Previous image" data-gallery-previous>
                        <svg class="gallery__previous-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/></g></svg>
                    </button>
                    <ul class="gallery__list" data-gallery-list>
                        <li
                            class="gallery__item"
                            data-gallery-item
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <img 
                                    alt="Image one"
                                    class="gallery__item-img"
                                    decoding="async"
                                    src="http://placehold.it/800x800"
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
            </div>
            <div role="region" class="gallery js-gallery-2" id="gallery">
                <h2 class="visually-hidden">Gallery</h2>
                <div class="gallery__header">
                    <div class="gallery__total" aria-live="polite" aria-atomic="true" data-gallery-live-region>1 of 5</div>
                    <button class="gallery__fullscreen" aria-label="Full screen" data-gallery-fullscreen>
                        <svg class="gallery__fullscreen-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
                    </button>
                </div>
                <div class="gallery__main">
                    <button class="gallery__previous" aria-label="Previous image" data-gallery-previous>
                        <svg class="gallery__previous-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/></g></svg>
                    </button>
                    <ul class="gallery__list" data-gallery-list>
                        <li
                            class="gallery__item"
                            data-gallery-item
                        >
                            <div class="gallery__item-img-container" data-gallery-item-img-container>
                                <img 
                                    alt="Image one"
                                    class="gallery__item-img"
                                    decoding="async"
                                    src="http://placehold.it/800x800"
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
            </div>`;

        const firstGroup = Array.from(document.querySelectorAll('.js-gallery .gallery__item'));
        const secondGroup = Array.from(document.querySelectorAll('.js-gallery-2 .gallery__item'));
        patchIds(firstGroup, 0);
        patchIds(secondGroup, 0);
        expect(firstGroup[0].id).toEqual('gallery-1-1');
        expect(firstGroup[1].id).toEqual('gallery-1-2');
        expect(secondGroup[0].id).toEqual('gallery-101-1');
        expect(secondGroup[1].id).toEqual('gallery-101-2');

    });

});
# Gallery

Accessible media gallery that can be used inline or in a modal.

---

## Usage

Create the gallery in HTML.

There must be an live region with a `data-gallery-live-region` attribute (an element with `aria-live="polite" aria-atomic="true"` for example) for the accessible announcements.
Each of the gallery items should have a `data-gallery-item` attribute and an id, which is used to update the document URL and makes slides addressable - you can link to a specific gallery slide using a URL hash matching a slide id. If ids are not added they are programmatically generated.

For navigation, `data-gallery-previous` and `data-gallery-next` attributes on buttons identify them as navigation triggers.

Optionally, a button with `data-gallery-fullscreen` attribute if supporting fullscreen functionality.

Optionally, any buttons with a `data-gallery-navigate` attribute will navigate the gallery to a specific slide, e.g. `data-gallery-navigate="2"`.

```
<div role="region" class="gallery js-gallery" id="gallery">
    <div class="gallery__header">
        <div class="gallery__total" aria-live="polite" aria-atomic="true" data-gallery-live-region>1 of 5</div>
        <button class="gallery__fullscreen" aria-label="Full screen" data-gallery-fullscreen>
            <svg class="gallery__fullscreen-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="33.547" height="33.281" viewBox="0 0 33.547 33.281">
                <g transform="translate(-1434 -40.572)">
                    <path d="M7.334,13.243a.919.919,0,0,0,.007-1.294L3.073,7.667l9.847,0a.914.914,0,0,0,0-1.828l-9.847,0L7.348,1.557A.925.925,0,0,0,7.341.263.91.91,0,0,0,6.054.27L.26,6.106h0a1.026,1.026,0,0,0-.19.288A.872.872,0,0,0,0,6.746a.916.916,0,0,0,.26.64l5.794,5.836A.9.9,0,0,0,7.334,13.243Z" transform="translate(1467.547 50.119) rotate(135)" fill="#fff"/>
                    <path d="M7.334,13.243a.919.919,0,0,0,.007-1.294L3.073,7.667l9.847,0a.914.914,0,0,0,0-1.828l-9.847,0L7.348,1.557A.925.925,0,0,0,7.341.263.91.91,0,0,0,6.054.27L.26,6.106h0a1.026,1.026,0,0,0-.19.288A.872.872,0,0,0,0,6.746a.916.916,0,0,0,.26.64l5.794,5.836A.9.9,0,0,0,7.334,13.243Z" transform="translate(1434 64.307) rotate(-45)" fill="#fff"/>
                </g>
            </svg>
        </button>
    </div>
    <div class="gallery__main">
        <button class="gallery__previous" aria-label="Previous image" data-gallery-previous>
            <svg class="gallery__previous-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/></g></svg>
        </button>
        <ul class="gallery__list" tabindex="0">
            <li class="gallery__item" data-gallery-item id="gallery-1">
                <div class="gallery__item-img-container">
                    <picture>
                        <source srcset="https://placehold.co/1600x1000.jpg" media="(min-width:1000px)">
                        <source srcset="https://placehold.co/1000x600.png" media="(min-width:700px)">
                        <source srcset="https://placehold.co/700x400.png" media="(min-width:400px)">
                        <img loading="lazy" src="https://placehold.co/500x200.png" alt="Test image">
                    </picture>
                </div>
                <div class="gallery__item-footer">
                    <div class="gallery__item-meta">
                        <div class="gallery__item-description">
                            <h2 class="gallery__item-artist">Kate Murphy</h2>
                            <div class="gallery__item-category">Architecture - March</div>
                            <div class="gallery__item-title">Example project name here</div>
                        </div>
                    </div>
                </div>
            </li>
            <li class="gallery__item" data-gallery-item id="gallery-2">
                <div class="gallery__item-img-container">
                    <picture>
                        <source srcset="https://placehold.co/1600x1400.jpg" media="(min-width:1100px)">
                        <source srcset="https://placehold.co/1100x1000.png" media="(min-width:710px)">
                        <source srcset="https://placehold.co/710x900.png" media="(min-width:400px)">
                        <img loading="lazy" src="https://placehold.co/420x300.png" alt="Test image">
                    </picture>
                </div>
                <div class="gallery__item-footer">
                    <div class="gallery__item-meta">
                        <div class="gallery__item-description">
                            <h2 class="gallery__item-artist">Kate Murphy</h2>
                            <div class="gallery__item-category">Architecture - April</div>
                            <div class="gallery__item-title">Example project name here</div>
                        </div>
                    </div>
                </div>
            </li>
            <li class="gallery__item" data-gallery-item id="gallery-3">
                <div class="gallery__item-img-container">
                    <picture>
                        <source srcset="https://placehold.co/1630x1500.jpg" media="(min-width:1300px)">
                        <source srcset="https://placehold.co/1300x1200.png" media="(min-width:730px)">
                        <source srcset="https://placehold.co/730x300.png" media="(min-width:430px)">
                        <img loading="lazy" src="https://placehold.co/430x300.png" alt="Test image">
                    </picture>
                </div>
                <div class="gallery__item-footer">
                    <div class="gallery__item-meta">
                        <div class="gallery__item-description">
                            <h2 class="gallery__item-artist">Kate Murphy</h2>
                            <div class="gallery__item-category">Architecture - May</div>
                            <div class="gallery__item-title">Example project name here</div>
                        </div>
                    </div>
                </div>
            </li>
            <li class="gallery__item" data-gallery-item id="gallery-4">
                <div class="gallery__item-img-container">
                    <picture>
                        <source srcset="https://placehold.co/1640x2400.jpg" media="(min-width:1400px)">
                        <source srcset="https://placehold.co/1400x2200.png" media="(min-width:740px)">
                        <source srcset="https://placehold.co/740x1200.png" media="(min-width:440px)">
                        <img loading="lazy" src="https://placehold.co/430x300.png" alt="Test image">
                    </picture>
                </div>
                <div class="gallery__item-footer">
                    <div class="gallery__item-meta">
                        <div class="gallery__item-description">
                            <h2 class="gallery__item-artist">Kate Murphy</h2>
                            <div class="gallery__item-category">Architecture - June</div>
                            <div class="gallery__item-title">Example project name here</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <button class="gallery__next" aria-label="Next image" data-gallery-next>
            <svg class="gallery__next-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12"/></g></svg>
        </button>
    </div>
</div>
```

Install the package
```
npm i -S @stormid/gallery
```

Initialise the gallery
```
import gallery from '@stormid/gallery';

const [instance] = gallery('js-gallery);

## Options

```
{
    startIndex: 0,
    selector: { //selectors for the gallery elements
        list: '[data-gallery-list]',
        item: '[data-gallery-item]',
        fullscreen: '[data-gallery-fullscreen]',
        liveRegion: '[data-gallery-live-region]',
        previous: '[data-gallery-previous]',
        next: '[data-gallery-next]',
        navigate: '[data-gallery-navigate]'
    },
    className: { // classNames used to style different gallery states
        active: 'is--active',
        fullscreen: 'is--fullscreen'
    },
    manualInitialisation: false, // to prevent automatic initialisation, so it can be initialised via the API
    updateURL: true, //change URL when item changes
    announcement(current, total){ //template for the accessible announcement
        return `${current} of ${total}`;
    }
}
```

## API
gallery() returns an array of instances. Each instance exposes the interface
```
{
    getState // return the current state Object
    initialise // to manually initialise if manualInitialisation setting is true
    goTo // navigate to a slide index (zero indexed)
    toggleFullScreen // set teh gallery to full screen
}
```

## Events
There are 2 events that an instance of the gallery dispatches:
- `gallery.initialised` when it's initialised
- `gallery.change` when navigating to a different slide


## Tests
```
npm t
```

## License
MIT
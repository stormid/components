# Modal Gallery

Accessible modal image gallery

---

## Usage

Install the package
```
npm i -S @stormid/modal-gallery
```

A modal gallery can be created with DOM elements, or programmatically created from a JS Object.

From HTML
```
<ul>
    <li>
        <a class="js-modal-gallery" href="//placehold.it/500x500" data-title="Image 1" data-description="Description 1" data-srcset="//placehold.it/800x800 800w, //placehold.it/500x500 320w">Image one</a>
    </li>
    <li>
        <a class="js-modal-gallery" href="//placehold.it/300x800" data-title="Image 2" data-description="Description 2" data-srcset="//placehold.it/500x800 800w, //placehold.it/300x500 320w">Image two</a
    ></li>
</ul>
```

Initialise the module
```
import modalGallery from '@stormid/modal-gallery';

const [ gallery ] = modalGallery('.js-modal-gallery');
```

Example MVP CSS
```
.modal-gallery__outer {
    display: none;
    opacity: 0;
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0,0,0,.9);
    transition: opacity 500ms ease;
}
.modal-gallery__outer.is--active {
    display: block;
    opacity: 1;
}
.modal-gallery__img-container {
    text-align:center;
}
.modal-gallery__img {
    margin:80px auto 0 auto;
    max-width:80%;
    max-height: 80vh;
}
.modal-gallery__item {
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    opacity:0;
    visibility:hidden;
}
.modal-gallery__item.is--active {
    opacity:1;
    visibility:visible;
}
.modal-gallery__next {
    position: fixed;
    bottom:50%;
    right:25px;
}
.modal-gallery__previous {
    position: fixed;
    bottom:50%;
    left:25px;
}
.modal-gallery__close {
    position: fixed;
    top:15px;
    right:25px;
}
.modal-gallery__close:hover svg,
.modal-gallery__previous:hover svg,
.modal-gallery__next:hover svg{
    opacity:.8
}
.modal-gallery__total {
    position: absolute;
    bottom:25px;
    right:25px;
    color:#fff
}
.modal-gallery__details {
    position: fixed;
    bottom:0;
    left:120px;
    right:120px;
    padding:0 0 40px 0;
    color:#fff;
}
```


To create from a JavaScript Object
```
import modalGallery from '@stormid/modal-gallery';

const [ gallery ] = modalGallery([
    {
        src: '//placehold.it/500x500',
        srcset:'//placehold.it/800x800 800w, //placehold.it/500x500 320w',
        title: 'Image 1',
        description: 'Description 1'
    },
    {
        src: '//placehold.it/300x800',
        srcset:'//placehold.it/500x800 800w, //placehold.it/300x500 320w',
        title: 'Image 2',
        description: 'Description 2'
    }
]);

//e.g. Open the gallery at the second item (index 1) by clicking on a button with the className 'js-modal-gallery__trigger'
document.querySelector('.js-modal-gallery__trigger').addEventListener('click', () => gallery.open(1));
```

## Options

```
{
    fullscreen: false, //show gallery in fullscreen
    preload: false, //preload all images
    totals: true,   //show totals
    scrollable: false, //modal is scrollable
    single: false, //single image or gallery
}
```

## API

modalGallery() returns an array of instances. Each instance exposes the interface
```
{
    getState, a Function that returns the current state Object
    open, a Function that opens the modal gallery
}
```

## Tests
```
npm t
```

## License
MIT
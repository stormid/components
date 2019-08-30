# Modal

Accessible modal dialog.

## Usage
HTML
```
<button class="js-modal-toggle">Open modal</button>
    <div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
        <div class="modal__close js-modal-close js-modal-toggle" aria-label="close">
        </div>
        <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
            <h1 id="modal-label"></h1>
            <button>Focusable element</button>
            <input type="text">
            <input type="text">
            <button class="modal__close-btn js-modal-toggle" aria-label="close" >
                <svg focusable="false" fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </button>
        </div>
    </div>
```

JS
```
npm i -S @stormid/modal
```
either using es6 import
```
import Modal from '@stormid/modal';

Modal.init('.js-modal');
```
asynchronous browser loading (use the .standalone version in the /dist folder) using the global name 'Modal'
```
import Load from '@stormid/load';

Load('https://unpkg.com/stormid/umd/@stormid/modal.js')
    .then(() => {
        Modal.init('.js-modal');
    });
```

## Options
```
{
	onClassName: 'is--active', //className added to node when modal is open
    mainSelector: 'main', //querySelector to select main element to set aria-hidden attribute
    toggleSelectorAttribute: 'data-modal-toggle', //attribute on node to use as toggle selector
    callback: false, //optional function called after modal state change
    delay: 0 //ms delay before focus on first focuable element
}
```

e.g.
```
Modal.init('.js-modal', {
    callback(){
        console.log(this);
    }
});
```

## Tests
```
npm t
```

## Browser support
This is module has both es6 and UMD distributions. It depends upon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT
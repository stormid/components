# Modal

Accessible modal dialog.

Example implementations of specific types of modal are available for reference at https://storm-ui-patterns.netlify.app/.

---

## Usage

Create a modal dialog and button(s) to toggle in HTML
```
<button class="js-modal-toggle">Open modal</button>
<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle" hidden>
    <div class="modal__inner" role="dialog" aria-labelledby="modal-label">
        <h2 id="modal-label">Modal title</h2>
        ...
        <button class="modal__close-btn js-modal-toggle" aria-label="close">
            <svg focusable="false" fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
        </button>
    </div>
</div>
```

Install the package
```
npm i -S @stormid/modal
```

Import the module
```
import modal from '@stormid/modal';
```

Initialise the module via selector string
```
const [ instance ] = modal('.js-modal');
```

Initialise with a DOM element
```
const element = document.querySelector('.js-modal');
const [ instance ] = modal(element);
```

Initialise with a Node list
```
const elements = document.querySelectorAll('.js-modal');
const [ instance ] = modal(elements);
```

Initialise with an Array of elements
```
const elements = [].slice.call(document.querySelectorAll('.js-modal'));
const [ instance ] = modal(elements);
```

CSS
The className 'is--modal' added to the document.body when the modal is open. This can be used to prevent the body from scrolling and to use CSS to modify other parts of the document.

```
.is--modal {
    overflow: hidden;
}
```

## Options
Options can be set during initialising in an Object passed as the second argument to the modal function, e.g. `modal('.js-modal', { startOpen: true })`, or as data-attributes on the modal element (the element passed to the initialisation function), e.g. `data-start-open="true"`
```
{
    onClassName: 'is--active', //className added to node when modal is open
    toggleSelectorAttribute: 'data-modal-toggle', //attribute on node to use as toggle selector
    callback: false, //optional function called after modal state change
    delay: 0, //ms delay before focus on first focuable element
    startOpen //boolean, to trigger modal to open when initialised    
}
```

## API
modal() returns an array of instances. Each instance exposes the interface
```
{
    getState, a Function that returns the current state Object
    open, a Function that opens the modal
    close a Function that closes the modal
}
```

## Events
There are two custom events that an instance of the cookie banner dispatches:
- `modal.open` when the modal is opened
- `modal.close` when it is closed

The events are dispatched on the document. A reference to the getState function of the instance is contained in the custom event detail.

```
const [instance] = modal('.js-modal', options);

document.addEventListener('modal.open', e => {
    const state = e.detail.getState();
    // do something with state if we want to
});


## Tests
```
npm t
```

## License
MIT
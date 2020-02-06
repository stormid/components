# Modal

Accessible modal dialog

---

## Usage

Create a modal dialog and button(s) to toggle in HTML
```
<button class="js-modal-toggle">Open modal</button>
<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
    <div class="modal__inner" role="dialog" aria-modal="true" aria-labelledby="modal-label">
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

Inititialise the module
```
import modal from '@stormid/modal';

modal('.js-modal');
```

## Options
```
{
    onClassName: 'is--active', //className added to node when modal is open
    toggleSelectorAttribute: 'data-modal-toggle', //attribute on node to use as toggle selector
    callback: false, //optional function called after modal state change
    delay: 0 //ms delay before focus on first focuable element
}
```

## API
modal() returns an array of instances. Each instance exposes the interface
```
{
    getState, a Function that returns the current state Object
}
```

## Tests
```
npm t
```

## License
MIT
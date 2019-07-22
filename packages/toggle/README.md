# Toggle

Accessible DOM state toggling for off-canvas and show/hide UI patterns.

## Usage
For page-level state toggling (e.g. an off-canvas menu)

HTML
```
<button class="js-toggle-btn">Menu</button>
<nav class="js-toggle" data-toggle="js-toggle-btn">...</nav>
```

JS
```
npm i -S storm-toggle
```
either using es6 import
```
import Toggle from 'storm-toggle';

Toggle.init('.js-toggle');
```
aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/storm-toggle.standalone.js')
    .then(() => {
        Toggle.init('.js-toggle');
    });
```

### Local toggle
To encapsulate a toggle state within part of the document (e.g. show/hide buttons)

HTML
```
<div class="parent">
    <button class="js-toggle__btn"></a>
    <div class="js-toggle__local" data-toggle="js-toggle__btn"></div>
</div>
```

CSS
```
.child {
    display: none
}
.parent.active .child {
    display: static;
}
```

## Options
```
{
    delay: 0, //duration of animating out of toggled state
    startOpen: false,  //initial toggle state
    local: false, // encapsulate in small part of document
    prehook: false, //function to fire before each toggle
    callback: false, //function to fire after each toggle
    focus: false, //focus on first focusable child node of the target element
    trapTab: false, //trap tab in the target element
    closeOnBlur: false, //close the target node on losing focus from the target node and any of the toggles
    closeOnClick: false, //close the target element when a non-child element is clicked
}
```
e.g.
```
Toggle.init('.js-toggle', {
    startOpen: true
});
```

Options can also be set on an instance by adding data-attributes to the toggle element, e.g. 
```
<div class="parent">
    <button class="js-toggle__btn"></a>
    <div class="js-toggle__local" data-toggle="js-toggle__btn" data-start-open="true"></div>
</div>
```


## Tests
```
npm t
```

## Browser support
This is module has both es6 and es5 distributions.

The es5 version depends upon Object.assign so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfils for Array functions and eventListeners.

## Dependencies
None

## License
MIT
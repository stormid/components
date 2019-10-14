# Toggle

Accessible DOM state toggling for off-canvas and show/hide UI patterns.

## Usage
For page-level state toggling (e.g. an off-canvas menu)

HTML
```
<button class="js-toggle-btn">Menu</button>
<nav id="primawry-navigation" aria-label="Main navigation" class="js-toggle" data-toggle="js-toggle-btn">...</nav>
```

JS
```
npm i -S @stormid/toggle
```
```
import Toggle from '@stormid/toggle';

Toggle.init('.js-toggle');
```


### Local toggle
To localise a toggle state to part of the document (e.g. show/hide panel)

HTML
```
<div class="parent">
    <button class="js-toggle__btn"></a>
    <div id="child" class="js-toggle__local" data-toggle="js-toggle__btn"></div>
</div>
```

CSS
```
.child {
    display: none
}
.parent.is--active .child {
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

## License
MIT
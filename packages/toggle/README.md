# Toggle

Accessible DOM state toggling for off-canvas and show/hide UI patterns using aria-expanded.

---

## Usage
For page-level state toggling (e.g. an off-canvas menu)

Create a target and related button(s) in HTML
```
<button class="js-toggle-btn">Menu</button>
<nav id="primary-navigation" aria-label="Main navigation" class="js-toggle" data-toggle="js-toggle-btn">...</nav>
```

Install the package
```
npm i -S @stormid/toggle
```

Initialise the module
```
import toggle from '@stormid/toggle';

const [ instance ] = toggle('.js-toggle');
```


### Local toggle
To localise a toggle state to part of the document (e.g. show/hide panel)

Create a target and related button(s) in HTML
```
<div class="parent">
    <button class="js-toggle__btn"></a>
    <div id="child" class="js-toggle__local" data-toggle="js-toggle__btn"></div>
</div>
```

Example MVP CSS
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
const [ instance ] = toggle('.js-toggle', {
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

A toggle can also be started open usng the active className alone, e.g.
```
<div class="parent is--active">
    <button class="js-toggle__btn"></a>
    <div class="js-toggle__local" data-toggle="js-toggle__btn"></div>
</div>
```

## API

toggle() returns an array of instances. Each instance exposes the interface
```
{
    node, DOMElement, the text area
    startToggle, a Function that starts the toggle lifecycle with prehook, toggle, and post-toggle callback
    toggle, a Function that just executes the toggle
    getState, a Function that returns the current state Object
}
```

## Tests
```
npm t
```

## License
MIT
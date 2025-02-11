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

Import the module
```
import toggle from '@stormid/toggle';
```

Initialise the module via selector string
```
const [ instance ] = toggle('.js-toggle');
```

Initialise with a DOM element
```
const element = document.querySelector('.js-toggle');
const [ instance ] = toggle(element);
```

Initialise with a Node list
```
const elements = document.querySelectorAll('.js-toggle');
const [ instance ] = toggle(elements);
```

Initialise with an Array of elements
```
const elements = [].slice.call(document.querySelectorAll('.js-toggle'));
const [ instance ] = toggle(elements);
```

### Local toggle
To localise a toggle state to part of the document (e.g. show/hide panel)

Create a target and related button(s) in HTML
```
<div class="parent">
    <button type="button" class="js-toggle__btn"></button>
    <div id="child" class="js-toggle__local child" data-toggle="js-toggle__btn"></div>
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
    focus: true, //focus on first focusable child node of the target element
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
    <button type="button" class="js-toggle__btn"></button>
    <div class="js-toggle__local" data-toggle="js-toggle__btn" data-start-open="true"></div>
</div>
```

A toggle can also be started open usng the active className alone, e.g.
```
<div class="parent is--active">
    <button type="button" class="js-toggle__btn"></button>
    <div class="js-toggle__local" data-toggle="js-toggle__btn"></div>
</div>
```

### Developer note 06 Sep 2022:  Use of closeOnBlur
It should be noted that at the time of writing, the availaibility of the blur event was limited on mobile assistive tech, specifically iOS VoiceOver.  

When a user is swiping through content in VoiceOver, the focus/blur events will only fire if the focus is moving to or from a form input element or button.  The focus/blur events will not fire when moving between links, headings or in-page content.  Any use of the closeOnBlur setting should be carefully tested to make sure that the behaviour is as expected on these devices.   

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

## Events

There are two custom events that an instance of the toggle dispatches:
- `toggle.open` when it opens
- `toggle.close` when closes

The events are dispatched on the same element used to initialise the toggle and bubble for event delegation. The a reference to the getState function of the instance is contained in the custom event detail.

```
const [ instance ] = toggle('.js-toggle');

//event bubbles so can delegate
//could also add event listener to document.querySelector('.js-toggle')
document.addEventListener('toggle.open', e => {
  const { node, toggles } = e.detail.getState();
  // do something
});

```


## Tests
```
npm t
```

## License
MIT

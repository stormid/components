# Toggle

Accessible DOM state toggling utility to support the expansion and collapse of regions of HTML documents using aria-expanded. Useful for expandable sections and off-canvas navigation patterns.

For well-tested implementations of UI patterns using Toggle look at https://storm-ui-patterns.netlify.app.

---

## Usage
For well-tested implementations of UI patterns using Toggle look at https://storm-ui-patterns.netlify.app.

To install
```
npm i -S @stormid/toggle
```

### Full document toggle
Useful for document-level state changes that affect the whole page, such as an off-canvas menu.

1. Set up the DOM elements
The element you want to toggle state, and related button(s) that will trigger state change. The `data-toggle` attribute of the target element (nav in the example below) is used as a selector to find buttons that trigger state change. The target element should have a unique id.

Simplified example:
```
<button class="js-toggle-btn">Menu</button>
<nav id="primary-navigation" aria-label="Main navigation" class="js-toggle" data-toggle="js-toggle-btn">...</nav>
```

1. Set up CSS
Toggle changes DOM attributes and CSS classNames but all visible changes to the UI are left to the developer to implement in CSS.

For a full document Toggle a className is added to the document element (html) based on the target id - "on--" plus the target id.

Simplified example:
```
.nav {
    display: none;
}
.on--primary-navigation .nav {
    display: block;
}
```

3. Set up JavaScript
Install
```
npm i -S @stormid/toggle
```

Implement
```
import toggle from '@stormid/toggle';

const [ instance ] = toggle('.js-toggle');
```
In addition to a CSS selector, Toggle also supports initialisation via 

DOM element
```
const element = document.querySelector('.js-toggle');
const [ instance ] = toggle(element);
```

Node list
```
const elements = document.querySelectorAll('.js-toggle');
const [ instance ] = toggle(elements);
```
Array of elements
```
const elements = [].slice.call(document.querySelectorAll('.js-toggle'));
const [ instance ] = toggle(elements);
```

### Localised toggle
Useful for localised state changes affecting a smaller part of the document, such as an exapandable section.

1. Set up the DOM
Simplified example
```
<div class="expandable">
    <button type="button" class="js-toggle__btn"></button>
    <div id="child" class="js-toggle__local child" data-toggle="js-toggle__btn"></div>
</div>
```

2. Set up CSS
A className ('is--active') is added to the parentNode of the target in a localised toggle.

Simplified example
```
.child {
    display: none
}
.parent.is--active .child {
    display: block;
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
    useHidden: false //add and remove hidden attribute to toggle target
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

Inititalisation returns an array of instances for each target element. Each instance exposes the interface
```
{
    node, DOMElement, the element to expand and collapse
    startToggle, a Function that starts the toggle lifecycle with prehook, toggle, and post-toggle callback
    toggle, a Function that just executes the toggle
    getState, a Function that returns the current state Object
}
```

## Events

There are two custom events that an instance of the toggle dispatches:
- `toggle.open` when it opens
- `toggle.close` when closes

The events are dispatched on the same element used to initialise the toggle and bubble for event delegation. A reference to the getState function of the instance is contained in the custom event detail.

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

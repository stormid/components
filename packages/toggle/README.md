# Toggle

Accessible DOM state toggling utility to support the expansion and collapse of regions of HTML documents using aria-expanded. Useful for expandable sections and off-canvas navigation patterns.

For well-tested implementations of UI patterns using Toggle look at https://storm-ui-patterns.netlify.app.

---

## Usage

To install
```
npm i -S @stormid/toggle
```

### Full document toggle
Useful for document-level state changes that affect the whole page, such as an off-canvas menu.

1. Set up the DOM elements

The element you want to toggle state, and related button(s) that will trigger state change. The `data-toggle` attribute of the target element (nav in the example below) is used as a selector to find buttons that trigger state change. The target element must have a unique id, which the triggers reference with `aria-controls`.

Simplified example:
```
<button class="js-toggle-btn">Menu</button>
<nav id="primary-navigation" aria-label="Main navigation" class="js-toggle" data-toggle="js-toggle-btn">...</nav>
```

2. Set up CSS

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
Useful for localised state changes affecting a smaller part of the document, such as an expandable section.

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
    delay: 0, //duration in milliseconds of the toggle off process, to allow for exit animations
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

Options can also be set per element by adding data-attributes to the toggle element, e.g.
```
<div class="parent">
    <button type="button" class="js-toggle__btn"></button>
    <div id="child" class="js-toggle__local" data-toggle="js-toggle__btn" data-start-open="true"></div>
</div>
```

Data-attributes are applied **after** the options passed to `toggle()`, so a single initialisation call can be tuned per element. Their values are coerced to the type of the matching option, so `data-start-open="false"` is the Boolean `false` and `data-delay="200"` is the Number `200`.

A toggle can also be started open using the active className alone, e.g.
```
<div class="parent is--active">
    <button type="button" class="js-toggle__btn"></button>
    <div id="child" class="js-toggle__local" data-toggle="js-toggle__btn"></div>
</div>
```

## Animating classNames

While a toggle is closing, an animating className is added to the same element that carries the status className, and removed when the toggle completes. Combined with `delay` this holds the open state in the DOM for long enough to run an exit animation.

| | status className | animating className | applied to |
|---|---|---|---|
| Full document toggle | `on--<id>` | `is--animating` | `html` |
| Localised toggle | `is--active` | `animating--<id>` | the target's parentNode |

`delay` defers the toggle off process only, so the animating className is only useful for exit animations.

```
const [ instance ] = toggle('.js-toggle', { delay: 200 });
```
```
.on--primary-navigation .nav {
    transform: translateX(0);
    transition: transform 200ms;
}
.on--primary-navigation.is--animating .nav {
    transform: translateX(100%);
}
```

## API

Initialisation returns an array of instances, one for each target element, and an empty array if no elements match the selector. Each instance exposes the interface
```
{
    node, DOMElement, the element to expand and collapse
    startToggle, a Function that starts the toggle lifecycle with prehook, toggle, and post-toggle callback
    toggle, a Function that just executes the toggle
    getState, a Function that returns the current state Object
    destroy, a Function that closes the toggle and removes its event listeners
}
```

`destroy` closes the toggle first, so the status className, the `hidden` attribute and focus are all restored, then removes every listener the instance added. It does not fire the prehook or callback, is not deferred by `delay`, and is safe to call more than once.

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

## Notes and limitations

- The target element requires an `id` and a `data-toggle` attribute naming the className of its triggers. Toggle warns and does not initialise if either is missing, rather than throwing.
- Only `button` and `a` elements are accepted as triggers. Anchors are given `role="button"` and activate on Space as well as click; an anchor without an `href` is also given `tabindex="0"` so it stays reachable.
- Escape does not close the toggle. Toggle is used for expandable regions as well as overlays, and dismissing an expandable section on Escape is not expected behaviour. Add your own keydown handler if you need it for an overlay.
- `closeOnBlur` and `closeOnClick` close the toggle through the full lifecycle, so the prehook, callback and animating className apply to those closes too. Focus is not returned to the trigger in that case, because the user has deliberately moved it elsewhere.
- When `focus` or `trapTab` is set, focus is moved into the target on open and returned to wherever it came from on close.
- At the time of writing, the availability of the blur event is limited on mobile assistive tech, specifically iOS VoiceOver. When a user is swiping through content in VoiceOver, the focus/blur events will only fire if the focus is moving to or from a form input element or button. The focus/blur events will not fire when moving between links, headings or in-page content. Any use of the `closeOnBlur` setting should be carefully tested to make sure that the behaviour is as expected on these devices.
- Importing the module is side-effect-free (SSR safe); call the default export in the browser only.

## Browser support

All modern browsers. Toggle relies only on `CustomEvent`, `classList`, `dataset` and `Node.contains`, so no polyfills are needed in any browser that supports the ES2018 output of the build.

## Tests
```
npm t
```

## License
MIT

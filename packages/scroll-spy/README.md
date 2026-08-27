# Scroll Spy

Use the IntersectionObserver API to check when a section of the document is in view and add a className to an associated DOM node.

Useful for scroll position-related navigation state management.

---

## Example usage
```
<header>
    <nav aria-label="Document sections">
        <a class="js-scroll-spy" href="#section1">Section 1</a>
        <a class="js-scroll-spy" href="#section2">Section 2</a>
        <a class="js-scroll-spy" href="#section3">Section 3</a>
    </nav>
</header>
<main>
    <section id="section1" aria-label="Section 1">
    ...
    </section>
    <section id="section2" aria-label="Section 2">
    ...
    </section>
    <section id="section3" aria-label="Section 3">
    ...
    </section>
</main>
```

Install the package
```
npm i -S @stormid/scroll-spy
```

Import the module
```
import scrollSpy from '@stormid/scroll-spy';
```

Initialise the module via selector string
```
const instance = scrollSpy('.js-scroll-spy');
```

Initialise with a DOM element
```
const element = document.querySelector('.js-scroll-spy');
const instance = scrollSpy(element);
```

Initialise with a Node list
```
const elements = document.querySelectorAll('.js-scroll-spy');
const instance = scrollSpy(elements);
```

Each spy must be an anchor whose `href` hash (e.g. `#section1`) matches the `id` of a section in the document. Anchors with a missing hash or an unresolvable target are skipped with a console warning.

Initialise with an Array of elements
```
const elements = [].slice.call(document.querySelectorAll('.js-scroll-spy'));
const instance = scrollSpy(elements);
```

## Options
```
{
	root: null, //element that is used as the viewport for checking visiblity of the target, defaults to document viewport if null
	rootMargin: '0px 0px 0px 0px', //margin around the root, px or percentage values
	threshold: 0, //Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed
    activeClassName: 'is--active', //className added when in view
	single: true // boolean to indicate whether a single or multiple spies can be active at once
}
```

When a spy becomes active it also receives `aria-current="true"`, which is removed again when it becomes inactive.

## API

`scrollSpy()` returns a single instance that manages all matched nodes together, or `undefined` (with a console warning) if no elements match the selector. The instance exposes the interface
```
{
    getState, //a Function that returns the current state Object
    destroy //a Function that disconnects the observers, removes the scroll listener and clears the active state
}
```

## Events
An instance dispatches two custom events as the active state changes:
- `scroll-spy.active` when a spy node becomes active
- `scroll-spy.inactive` when a spy node becomes inactive

The events are dispatched on the document and bubble. The event `detail` contains the instance `getState` function plus the `node` (the spy element) and `target` (the section) that changed.

```
const instance = scrollSpy('.js-scroll-spy', options);

document.addEventListener('scroll-spy.active', e => {
    const { node, target, getState } = e.detail;
    // node is the link that just became active, target is its section
});
```

## Tests
```
npm t
```

## Browser support
Depends on [IntersectionObserver API](https://caniuse.com/#feat=intersectionobserver).

## License
MIT

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
const [ instance ] = scrollSpy(elements);
```

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
	callback: null, //function executed when intersecting view
	single: true // boolean to indicate whether a single or multiple spies can be active at once
}
```

## API

scrollSpy() returns an array of instances. Each instance exposes the interface
```
{
    getState, a Function that returns the current state Object
}
```

## Tests
```
npm t
```

## Browser support
Depends on [IntersectionObserver API](https://caniuse.com/#feat=intersectionobserver).

## License
MIT


# Scroll points

Trigger className changes and callbacks based on scroll using IntersectionObservers. 

---

## Usage
Add the selector to the DOMElement you wish to become a scroll-point
```
<div class="js-scroll-point"></div>
```

Install the package
```
npm i -S @stormid/scroll-points
```

Import the module
```
import scrollPoints from '@stormid/scroll-points';
```

Initialise the module via selector string
```
const [ instance ] = scrollPoints('.js-scroll-points');
```

Initialise with a DOM element
```
const element = document.querySelector('.js-scroll-points');
const [ instance ] = scrollPoints(element);
```

Initialise with a Node list
```
const elements = document.querySelectorAll('.js-scroll-points');
const [ instance ] = scrollPoints(elements);
```

Initialise with an Array of elements
```
const elements = [].slice.call(document.querySelectorAll('.js-scroll-points'));
const [ instance ] = scrollPoints(elements);
```

## Options
```
{
	root: null, //element that is used as the viewport for checking visiblity of the target, defaults to viewport if null
	rootMargin: '0px 0px 0px 0px', //margin around the root, px or percentage values
	threshold: 0, //Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed
	callback: false, //function executed when target is intersecting
	className: 'is--scrolled-in', //className added when target is intersecting
	unload: true //unload intersection observer after target has intersected once
	replay: false //remove className when target is not intersecting
};
```

## Tests
```
npm t
```

## Browser support
Depends on [IntersectionObserver API](https://caniuse.com/#feat=intersectionobserver).

## License
MIT

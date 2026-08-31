
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
const [ instance ] = scrollPoints('.js-scroll-point');
```

Initialise with a DOM element
```
const element = document.querySelector('.js-scroll-point');
const [ instance ] = scrollPoints(element);
```

Initialise with a Node list
```
const elements = document.querySelectorAll('.js-scroll-point');
const [ instance ] = scrollPoints(elements);
```

Initialise with an Array of elements
```
const elements = [].slice.call(document.querySelectorAll('.js-scroll-point'));
const [ instance ] = scrollPoints(elements);
```

> If the selector matches no elements (or `IntersectionObserver` is unsupported), `scrollPoints` returns `undefined` after logging a warning — guard before destructuring the result.

## Instance
Each returned instance exposes the observed `node`, its merged `settings`, and a `destroy()` method that stops the underlying IntersectionObserver and removes the applied className — useful for cleanup in single-page apps when `unload: false`.
```
const [ instance ] = scrollPoints('.js-scroll-point', { unload: false });
// later, e.g. before removing the node from the DOM
instance.destroy();
```

## Options
```
{
	root: null, //element used as the viewport for checking visibility of the target, defaults to the browser viewport if null
	rootMargin: '0px 0px 0px 0px', //margin around the root, px or percentage values
	threshold: 0, //a single number or an array of numbers indicating at what percentage of the target's visibility the observer's callback should be executed
	callback: false, //function executed when the target is intersecting, called as callback(entry, { node, settings, observer })
	className: 'is--scrolled-in', //className added when the target is intersecting
	unload: true, //disconnect the intersection observer after the target has intersected once (ignored when replay is true)
	replay: false //remove the className when the target stops intersecting; requires unload: false to keep observing
};
```

### callback
When set, `callback` is invoked on each intersection with the native [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) and a context object:
```
scrollPoints('.js-scroll-point', {
	callback(entry, { node, settings, observer }) {
		console.log(entry.intersectionRatio, node);
	}
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

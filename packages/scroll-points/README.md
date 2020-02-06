
# Scroll points

Trigger className changes and callbacks based on element intersecting the viewport using IntersectionObservers. 

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

Initialise the module
```
import scrollPoints from '@stormid/scroll-points';

const [ point ] = scrollPoints('.js-scroll-point');
```

## Options
```
{
	root: null, //element that is used as the viewport for checking visiblity of the target
	rootMargin: '0px 0px 0px 0px', //margin around the root, px or percentage values
	threshold: 0, //Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed
	callback: false, //function executed when scrolled into view
	className: 'is--scrolled-in', //className added when scrolled into view
	unload: true //only callback once
};
```

## Tests
```
npm t
```

## Browser support
Depends on Object.assign and the [IntersectionObserver API](https://caniuse.com/#feat=intersectionobserver), IE11 will require polyfills.

## License
MIT

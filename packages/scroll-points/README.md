
# Scroll points

Trigger className changes and callbacks when an element scrolls into view using IntersectionObservers.

---

## Usage
HTML
```
<div class="js-scroll-point"></div>
```

JS
```
npm i -S component-boilerplate
```
```
import ScrollPoints from '@stormid/scroll-points';

ScrollPoints.init('.js-scroll-point');
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

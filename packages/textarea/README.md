
# Textarea

Auto-resizing textarea

## Usage

JS
```
npm i -S @stormid/textarea
```
either using es6 import
```
import Textarea from '@stormid/textarea';

Textarea.init('textarea');
```
asynchronous browser loading (use the .standalone version in the /dist folder) using the global name (Storm + capitalised package name)
```
import Load from '@stormid/load';

Load('https://unpkg.com/stormid/umd/@stormid/boilerplate.js')
    .then(() => {
        Textarea.init('textarea');
    });
```

## Options
```
{
    events: [
		'input' //default textarea resize event
	]
}
```

## Tests
```
npm t
```

## Browser support
This is module has both es6 and UMD distributions. It depends upon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT


# Repeater


## Usage
HTML
```
```

JS
```
npm i -S @stormid/repeater
```
either using es6 import
```
import Repeater from '@stormid/repeater';

Repeater.init('.js-repeater');
```
asynchronous browser loading (use the .standalone version in the /dist folder) using the global name (Storm + capitalised package name)
```
import Load from 'storm-load';

Load('https://unpkg.com/stormid/umd/@stormid/repeater.js')
    .then(() => {
        Repeater.init('.js-repeater');
    });
```

## Options
```
{
    callback: null
}
```

e.g.
```
Repeater.init('.js-selector', {
    callback(){
        console.log(this);
    }
});
```

## Tests
```
npm test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends upon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT

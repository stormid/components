
# Component Name

This is a **boilerplate for developing UI components** by **StormId**.

Before use make sure to grep for “@stormid/boilerplate” and replace every occurrence as well as updating your tests, readme and example.

## Usage
HTML
```
<div class="js-boilerplate"></div>
```

JS
```
npm i -S @stormid/boilerplate
```
either using es6 import
```
import Boilerplate from '@stormid/boilerplate';

Boilerplate.init('.js-boilerplate');
```
asynchronous browser loading (use the .standalone version in the /dist folder) using the global name (Storm + capitalised package name)
```
import Load from '@stormid/load';

Load('https://unpkg.com/stormid/umd/@stormid/boilerplate.js')
    .then(() => {
        ComponentBoilerplate.init('.js-boilerplate');
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
Boilerplate.init('.js-selector', {
    callback(){
        console.log(this);
    }
});
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

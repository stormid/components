
# Conditional


## Usage
HTML
```
```

JS
```
npm i -S @stormid/conditional
```
either using es6 import
```
import ConditionalField from '@stormid/conditional';

ConditionalField.init('.js-conditional');
```
asynchronous browser loading (use the .standalone version in the /dist folder) using the global name (Storm + capitalised package name)
```
import Load from 'storm-load';

Load('https://unpkg.com/stormid/umd/@stormid/conditional.js')
    .then(() => {
        Conditional.init('.js-conditional');
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
Conditional.init('.js-selector', {
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

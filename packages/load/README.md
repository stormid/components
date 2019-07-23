# Load

Minimal promise-based script loader for parallel and series orchestrated JS file loading via script tags.

## Usage

JS
```
npm i -S @stormid/load
```
```
import Load, { series as LoadSeries } from '@stormid/load';

//load scripts in parallel
Load('script-name.js')
    .then(() => {
        //use loaded JS
    });

//load scripts in series
LoadSeries(['script-1.js', 'script-that-depends-on-script-1.js'])
    .then(() => {
        //use loaded JS
    });

```

## Tests
```
npm t
```

## Browser support
This is module has both es6 and es5 distributions.

The es5 version depends upon Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfils for Array functions and eventListeners.

## Dependencies
None

## License
MIT
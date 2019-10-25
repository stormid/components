
# Component Name

This is a **boilerplate for developing UI components** by **StormId**.

Before use make sure to grep for “@stormid/boilerplate” and replace every occurrence as well as deleting and re-initing .git and updating the package.json.

---

## Usage
HTML
```
<div class="js-boilerplate"></div>
```

JS
```
npm i -S @stormid/boilerplate
```
```
import Boilerplate from '@stormid/boilerplate';

Boilerplate.init('.js-boilerplate');
```

## Options
```
{
    callback: null
}
```

Example
```
Boilerplate.init('.js-selector', {
    callback(){
        console.log(this);
    }
});
```

## API
Each instance returned from init exposes the interface
```
{
    node, DOMNode augmented by init
    click, trigger the handleClick method
}
```

## Tests
```
npm t
```

## Browser support

## Dependencies

## License
MIT
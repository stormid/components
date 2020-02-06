
# Component Name

This is a **boilerplate for developing UI components** by **Storm Id**.

---

## Usage
Create a container element in HTML
```
<div class="js-boilerplate"></div>
```

Install the package
```
npm i -S @stormid/boilerplate
```

Initialise the module
```
import boilerplate from '@stormid/boilerplate';

boilerplate('.js-boilerplate');
```

## Options
```
{
    callback: null
}
```

For example
```
boilerplate('.js-selector', {
    callback(){
        console.log(this);
    }
});
```

## API
boilerplate() returns an array of instances. Each instance exposes the interface
```
{
    node, DOMNode augmented by initialisation
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
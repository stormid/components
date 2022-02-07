
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

Import the module
```
import boilerplate from '@stormid/boilerplate';

Initialise the module via selector string
```
const [ instance ] = boilerplate('.js-boilerplate');
```

Initialise with a DOM element
```
const element = document.querySelector('.js-boilerplate');
const [ instance ] = boilerplate(element);
```

Initialise with a Node list
```
const elements = document.querySelectorAll('.js-boilerplate');
const [ instance ] = boilerplate(elements);
```

Initialise with an Array of elements
```
const elements = [].slice.call(document.querySelectorAll('.js-boilerplate'));
const [ instance ] = boilerplate(elements);
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
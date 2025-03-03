
# Textarea

Auto-resizing textarea

---

## Usage

Install the package
```
npm i -S @stormid/textarea
```

Import the module
```
import textarea from '@stormid/textarea';
```

Initialise the module via selector string
```
const [ instance ] = boilerplate('.js-boilerplate');
```

Initialise with a DOM element
```
const element = document.querySelector('textarea');
const [ instance ] = textarea(element);
```

Initialise with a Node list
```
const elements = document.querySelectorAll('textarea');
const [ instance ] = textarea(elements);
```

Initialise with an Array of elements
```
const elements = [].slice.call(document.querySelectorAll('textarea'));
const [ instance ] = textarea(elements);
```

## Options
```
{
    events: [
        'input' //default textarea resize event
    ]
}
```

## API

Initialisation returns an array of instances. Each instance exposes the interface
```
{
    node, DOMElement, the textarea
    resize, Function to trigger resize
}
```

## Tests
```
npm t
```

## License
MIT
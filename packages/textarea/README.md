
# Textarea

Auto-resizing textarea

---

## Usage

Install the package
```
npm i -S @stormid/textarea
```

Initialise the module
```
import textarea from '@stormid/textarea';

textarea('textarea');
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

textarea() returns an array of instances. Each instance exposes the interface
```
{
    node, DOMElement, the text area
    resize, Function to trigger resize
}
```

## Tests
```
npm t
```

## License
MIT
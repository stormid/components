
# Textarea

Auto-resizing textarea

---

## Usage
JS
```
npm i @stormid/textarea
```
```
import Textarea from '@stormid/textarea';

Textarea.init('textarea');
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
Each instance returned from init exposes the interface
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


# Textarea

Progressive-enhancement fallback that auto-resizes a `<textarea>` to fit its content.

---

## You probably don't need this

Modern browsers resize a textarea to its content with a single line of CSS — no JavaScript:

```css
textarea {
    field-sizing: content;
}
```

This is supported in Chromium-based browsers (Chrome / Edge 123+) and Safari (18.4+). If your
audience is limited to those, use the CSS and skip this package.

Reach for this package when you need the same behaviour in browsers that don't yet support
`field-sizing` (notably Firefox — check [caniuse](https://caniuse.com/mdn-css_properties_field-sizing)
for the current picture). When it runs in a browser that *does* support `field-sizing`, it simply
applies the native property and attaches no JavaScript listeners — so you get the platform behaviour
where it exists and the JS fallback only where it's needed.

## Usage

Install the package
```
npm i -S @stormid/textarea
```

Import the module
```
import textarea from '@stormid/textarea';
```

Initialise via a selector string, a DOM element, a NodeList, or an Array of elements
```
const [ instance ] = textarea('textarea');
```
```
const element = document.querySelector('textarea');
const [ instance ] = textarea(element);
```
```
const elements = document.querySelectorAll('textarea');
const [ instance ] = textarea(elements);
```
```
const elements = [].slice.call(document.querySelectorAll('textarea'));
const [ instance ] = textarea(elements);
```

## Options
```
{
    events: [
        'input' // events that trigger a resize (fallback path only)
    ],
    forceFallback: false // set true to always use the JS fallback, even where field-sizing is supported
}
```

## API

Initialisation returns an array of instances, one per matched element. Each instance exposes
```
{
    node,      // DOMElement, the textarea
    resize,    // Function, force a resize (no-op when native field-sizing is active)
    destroy    // Function, remove listeners/observer (or the native property); call when tearing down
}
```

## Behaviour and notes

- On the fallback path a `ResizeObserver` keeps the height correct when the textarea's width
  changes (responsive layouts, late-loading web fonts) and when it becomes visible after being hidden.
- Height sizing accounts for `box-sizing` (both `content-box` and `border-box`).
- Importing the module is side-effect-free (SSR safe); call the default export in the browser only.
- Call `destroy()` when removing a textarea in long-lived / single-page apps to avoid leaking the
  listeners and observer.

## Browser support

- Native path: any browser with CSS [`field-sizing: content`](https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing).
- Fallback path: any browser with [`ResizeObserver`](https://caniuse.com/resizeobserver) (all evergreen
  browsers). Without `ResizeObserver`, resizing still works on the configured `events`.

## Tests
```
npm t
```

## License
MIT

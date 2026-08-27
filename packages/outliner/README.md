# Outliner

Adds a className to the documentElement on mouse interactions, and removes it on keyboard interactions, to be used as a CSS hook for hiding focus outlines from mouse users in legacy browsers that lack [:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) support.

---

## You probably don't need this

Every modern browser (Chrome/Edge 86+, Firefox 85+, Safari 15.4+) supports `:focus-visible` natively, which solves this problem in CSS alone with better heuristics than any script can offer:

```css
:focus-visible {
    outline: 3px solid blue;
}
```

Or, as a progressive enhancement that keeps a fallback focus style for older browsers:

```css
:focus {
    outline: 3px solid blue;
}
:focus:not(:focus-visible) {
    outline: none;
}
```

Only reach for this package if you must actively hide focus outlines from mouse users in browsers without `:focus-visible` support (pre-15.4 Safari, pre-86 Chrome/Edge, pre-85 Firefox).

## Usage

Install the package
```
npm i -S @stormid/outliner
```

Initialise the module
```
import '@stormid/outliner';

```

Example CSS, scoped to focus states only:
```
.no-outline :focus {
    outline: none;
}
```

Avoid removing outlines or box-shadows globally (e.g. `.no-outline * { outline: 0 !important; box-shadow: none !important; }`) — that also strips non-focus styling such as card and dropdown shadows, and fights any `:focus-visible` styles you have. If you use box-shadow focus rings, remove them on the same scoped focus selectors you own, not with a wildcard.

## Limitations

This is a coarse heuristic — two document-level listeners cannot match the browser's native `:focus-visible` behaviour:

- Any `keydown` (typing in a text field, pressing Escape or a modifier key) re-enables outlines globally until the next `mousedown`.
- Elements focused programmatically after a mouse interaction (modal focus management, skip-link targets) will have their outlines hidden. Keep visible focus indication for such targets to satisfy [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html), e.g. by excluding them from your `.no-outline` rules.

## Tests
```
npm t
```

## License
MIT

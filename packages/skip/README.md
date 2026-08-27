# Skip

Ensures fragment identifier links (e.g. "skip to content") move keyboard focus to their target node, not just the scroll position.

---

## You probably don't need this

Every modern browser already moves focus to a fragment target when that target is focusable. The simplest, most robust fix is a single static attribute on the target — no JavaScript:

```html
<main id="content" tabindex="-1">
```

`tabindex="-1"` makes the element programmatically focusable without adding it to the tab order, so activating `<a href="#content">Skip to main content</a>` scrolls to it *and* focuses it. This has zero runtime cost, no global listeners, no DOM mutation, and is safe to server-render.

Reach for this package only when you cannot add that attribute to your targets (e.g. markup you don't control), or when you need the two edge cases below handled automatically.

## What this adds

On top of native behaviour, this module:

- Moves focus to the target when a page is **loaded with a hash already in the URL** (a bookmarked, shared, or reloaded `…#content`). A lone `hashchange` listener misses this, because `hashchange` does not fire on initial load.
- Moves focus when a **same-page link is re-activated while its hash already matches the URL**. `hashchange` does not fire when the hash is unchanged, so a second click on the same skip link would otherwise do nothing.
- Adds `tabindex="-1"` to a target only when it is not already focusable, so non-focusable targets (a `<main>`, `<section>`, heading, etc.) can receive focus. Targets that are natively focusable, or that already carry a `tabindex`, are left untouched.

## Usage

Install the package
```
npm i -S @stormid/skip
```

Initialise the module
```
import '@stormid/skip';
```

Importing the module attaches the listeners; there is no configuration.

## Notes and limitations

- **It moves focus on load.** When the URL contains a matching fragment on load, focus is moved to that target — matching how browsers treat fragment navigation. If you do not want focus moved without a user action, do not use this module and rely on `tabindex="-1"` in your markup instead.
- **The added `tabindex="-1"` is left in place.** It is idempotent and keeps the target out of the tab order, so re-activation stays cheap; it is not removed on blur.
- **Focus targets must remain visibly focusable** to satisfy [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html). Keep a visible focus indicator on skip-link targets.
- Listeners are attached globally to `window`/`document`; the module is a passive enhancement with no instance API or teardown.

## Tests
```
npm t
```

## License
MIT

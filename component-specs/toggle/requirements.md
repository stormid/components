# Component requirements: toggle

> Worked example for the `/generate-component` pipeline. This is the requirements
> spec **reverse-engineered from the already-shipped `@stormid/toggle` package** —
> it shows what a filled-in spec looks like for a real, non-trivial stateful
> component. (The package already exists; this is a reference, not a build target.)

## Purpose

Accessible DOM state-toggling utility for expanding and collapsing regions of a
page using `aria-expanded` — expandable sections, off-canvas navigation, and
similar show/hide patterns. Toggle changes attributes and class names only; all
visible styling is left to the consumer's CSS.

## Archetype

A — per-node augmentation. Each toggled target element becomes its own instance;
init returns an array of instances.

## Behaviour

- Each target carries `data-toggle="<js-hook-class>"`; buttons with that class are
  the triggers for that target. A target should have a unique `id`.
- Clicking a trigger flips the target between open and closed. `startToggle` runs
  the full lifecycle (prehook → toggle → callback); `toggle` performs just the
  state flip.
- **Global toggle** (`local: false`): a class `on--<targetId>` is added to the
  document element while open.
- **Local toggle** (`local: true`): the class `is--active` is added to the
  target's `parentNode` instead.
- `startOpen: true` (or the target's parent already carrying `is--active`) starts
  the instance in the open state.
- When opening with `focus: true`, move focus to the first focusable child of the
  target. `trapTab: true` keeps Tab within the target while open.
- `closeOnBlur: true` closes the target when focus leaves it and all its triggers;
  `closeOnClick: true` closes it when a non-child element is clicked.
- `useHidden: true` adds/removes the `hidden` attribute on the target as it
  closes/opens.
- `delay` (ms) holds an animating-out state before the closed state settles, to
  support exit animations.

## Options

| Option | Type | Default | Read from `data-*`? | Description |
| --- | --- | --- | --- | --- |
| `delay` | number (ms) | `0` | yes | Duration the animating-out state persists |
| `startOpen` | boolean | `false` | yes | Start in the open state |
| `local` | boolean | `false` | yes | Localise class changes to the target's parent, not the document element |
| `prehook` | function | `false` | no | Called before each toggle begins |
| `callback` | function | `false` | no | Called after each toggle completes |
| `focus` | boolean | `true` | yes | Move focus to the first focusable child on open |
| `trapTab` | boolean | `false` | yes | Trap Tab within the target while open |
| `closeOnBlur` | boolean | `false` | yes | Close when focus leaves the target and its triggers |
| `closeOnClick` | boolean | `false` | yes | Close when a non-child element is clicked |
| `useHidden` | boolean | `false` | yes | Add/remove the `hidden` attribute on the target |

## Events dispatched

- `toggle.open` — when the target opens.
- `toggle.close` — when the target closes.

Both are dispatched on the initialising element, bubble for delegation, and carry
`detail: { getState }`.

## Accessibility

- Triggers keep `aria-expanded` in sync with state and reference the target via
  `aria-controls`; non-`<button>` triggers get `role="button"`.
- On open, focus moves into the target when `focus` is set; on close, focus is
  restored to the trigger. `trapTab` traps focus within the open target.
- With `useHidden`, the closed target is `hidden` and therefore keyboard-unreachable.
- Axe must report zero violations in every state.

## Async / remote data

None.

## Example-app scenarios

- A global toggle (off-canvas nav pattern) driven by a `.js-toggle-btn` button.
- A local toggle (`local: true`) expandable section adding `is--active` to its parent.
- An instance with `startOpen: true`.
- An instance with `useHidden: true` to show `hidden` being applied.
- An instance with `trapTab: true` to exercise focus trapping.

## Acceptance criteria

1. Init returns an array with one instance per target, each exposing
   `{ node, toggle, startToggle, getState }`.
2. Clicking a trigger flips `aria-expanded` on the trigger and toggles the
   open/closed state.
3. A global toggle adds `on--<targetId>` to the document element when open; a local
   toggle adds `is--active` to the target's parent.
4. `startOpen: true` initialises in the open state; so does a parent already
   carrying `is--active`.
5. Opening with `focus: true` moves focus to the first focusable child; closing
   restores focus to the trigger.
6. `data-*` attributes override options passed to init (e.g. `data-start-open`).
7. Opening dispatches `toggle.open` and closing dispatches `toggle.close`, both
   with a working `getState` in `detail`.
8. `useHidden: true` toggles the `hidden` attribute on the target.
9. Initialising against a selector matching nothing warns and returns without
   throwing.
10. Axe reports zero violations open and closed.

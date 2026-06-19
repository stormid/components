# Components

A Lerna monorepo of small, framework-agnostic JavaScript components published to npm under the `@stormid/*` scope. These are **behaviour** components (DOM augmentation, accessibility, interaction) — not UI/styling libraries. Vanilla JS, no framework, no runtime dependencies.

## Monorepo layout

- `packages/*` — one published package per component. Independent versioning (`lerna.json`).
- `packages/boilerplate` — **the canonical template for a new component**. It is the reference implementation; excluded from version bumps but kept in sync with current conventions.
- `tools/` — shared build/dev tooling.

To scaffold a new component, use the `new-component` skill — it has the full step-by-step recipe and test templates.

## Commands

Run per-package with `--scope=PACKAGE_NAME` (the package's `name`, e.g. `@stormid/toggle`):

| Task | Command |
| --- | --- |
| Dev example app | `lerna run dev --scope=PACKAGE_NAME` |
| Build for distribution | `lerna run build --scope=PACKAGE_NAME` |
| Test a package | `lerna run test --scope=PACKAGE_NAME` |
| Test all | `npm test` |
| Lint all (autofix) | `npm run lint -- --fix` |

Build is via **microbundle**; example apps run on **webpack-dev-server**. Node version is pinned in `.nvmrc`.

## The component contract

Every package's default export is a **factory function** with this exact shape. Match it when generating a new component:

```js
// src/index.js
import defaults from './lib/defaults';
import factory from './lib/factory';
import { getSelection } from './lib/utils';

export default (selector, options) => {
    const nodes = getSelection(selector);

    // No matches: warn and return (never throw)
    if (nodes.length === 0) return console.warn(`ComponentName not initialised, no elements found for selector '${selector}'`);

    // One instance object per matched node
    return nodes.map(node => Object.create(factory({
        settings: { ...defaults, ...options, ...node.dataset },
        node
    })));
};
```

Rules that keep components consistent:

- **Input flexibility**: `getSelection` (in `lib/utils`) accepts a string selector, an Array of nodes, a NodeList, or a single HTMLElement. Reuse it; don't reimplement selection.
- **Settings precedence**: `{ ...defaults, ...options, ...node.dataset }` — `data-*` attributes override instantiation options, which override defaults.
- **Return value**: always an array of instance objects created with `Object.create(factory(...))`. The factory's return value becomes the instance prototype.
- **Instance API shape**: the factory returns an object that always exposes `node` and `getState`, plus the component's action methods (e.g. toggle exposes `toggle`, `startToggle`). Keep public APIs to a small set of named functions.
- **Defaults** live in `src/lib/defaults.js` as a default-exported object (prefix the file with `/* istanbul ignore file */`).
- **Errors are warnings**: when input is missing or invalid, `console.warn` and return gracefully — components must never throw during init.

## File structure within a package

Minimal component (see `boilerplate`):

```
src/index.js            # factory entry (above)
src/lib/defaults.js     # default options object
src/lib/factory.js      # builds the instance: attaches listeners, returns API
src/lib/utils.js        # getSelection + pure helpers
```

Stateful component (see `toggle` — the reference for anything non-trivial), add:

```
src/lib/store.js        # createStore: { getState, update }
src/lib/dom.js          # DOM reads/writes, listeners, lifecycle effects
src/lib/constants.js    # shared string constants (events, selectors, focusable list)
```

## Patterns to follow

- **State**: use the minimal store pattern — `createStore()` returns `{ getState, update }`; `update(nextState, effects)` replaces state and runs an array of effect functions against the new state. No external state library.
- **Effects over inline mutation**: state transitions dispatch a list of effect functions (e.g. `[ toggleAttributes, manageFocus(store), broadcast(store) ]`) rather than mutating the DOM inline.
- **Event handlers needing `this`/`.bind()`** are written as non-arrow named function expressions with settings partially applied (e.g. `const handleClick = ({ callback }) => function handler(e) { ... }`).
- **Lifecycle hooks**: support optional `prehook` and `callback` functions in settings, invoked around the main action with relevant state passed in.
- **Cross-component communication**: dispatch `CustomEvent`s from the node with `{ bubbles: true, detail: { getState } }` so other components/consumers can react. Event names live in `constants.js`.
- **Naming conventions**: `js-` prefixed classes are JS hooks (never style them); `is--` / `on--` classes are state; `data-*` attributes carry config. Keep these consistent across components.

## Accessibility (a hard requirement, not an enhancement)

- Interactive triggers must set `aria-controls` and keep `aria-expanded` in sync with state; non-`<button>` triggers get `role="button"`.
- Manage focus explicitly: move focus into opened regions when configured, restore it to the previously focused element on close, and support focus trapping where relevant.
- Use the `hidden` attribute / focusability so closed regions are unreachable by keyboard.
- **Playwright runs axe-core; zero violations is required** — an a11y violation fails the build.

## Testing (both layers are required)

- **Jest** unit tests in `packages/*/__tests__/jest/` (jsdom env, run with `--coverage`). Every component has an init suite asserting: the returned array length, the instance API shape, no-throw when no nodes match, and that `data-*` overrides options.
- **Playwright** e2e + a11y tests in `packages/*/__tests__/playwright/`, organised into `Functionality` / `Keyboard` / `Aria` / `Axe` describe blocks (tagged `@all` / `@reduced`). The `Axe` block asserts zero violations.
- A package's `test` script runs both layers. The `new-component` skill has the exact test templates.

## Code style

Enforced by `@stormid/eslint-config` (lint before committing). Observed conventions: ES modules, 4-space indentation, single quotes, semicolons, arrow functions for top-level/pure helpers, JSDoc-style block comments on exported functions. Don't fight the linter — run `npm run lint -- --fix`.

## Per-package docs

Each package has a `README.md` that is its public npm documentation — keep it accurate when changing behaviour or options, and register new packages in the root `README.md` table.

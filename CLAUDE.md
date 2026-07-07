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
| Lint all | `npm run lint` |
| Lint all (autofix) | `npm run lint:fix` |

Build is via **microbundle**; example apps run on the **rspack dev server**. Node version is pinned in `.nvmrc`.

## Component archetypes

The library has **four legitimate component shapes**. The contract below describes the default (Archetype A); the others deliberately differ, and the differences are not drift. Identify the archetype before applying any rule.

- **A — Per-node augmentation** (default): one instance per matched node, via the factory contract below. `boilerplate`, `toggle`, `modal`, `tabs`, `scroll-points`, `textarea`, `validate`. **The full contract applies.**
- **B — Shared state across nodes**: one instance coordinates many nodes through a single state machine, so it returns a single object, not an array. `scroll-spy`, `modal-gallery` (gallery mode). Exempt from the per-node / array-return rules.
- **C — Singleton**: one per page, no selector — takes options only and renders its own DOM. `cookie-banner`. Exempt from `getSelection` / array-return; its DOM-effects file is named `ui.js` (an accepted variant of `dom.js`).
- **D — Side-effect module**: runs on import to attach a global listener; no factory, no defaults, no instance API. `outliner`, `skip`. Exempt from the factory contract and from the unit-test layer (Playwright-only is fine).

**Required of every component** (within its archetype): never throw on init; settings precedence `defaults → options → dataset` wherever `data-*` is read; `defaults.js` default-exported and prefixed `/* node:coverage disable */`; accessibility correct with axe passing; a `README.md` registered in the root table; and — for any component with DOM/a11y behaviour — both test layers with an axe block (see Testing).

**Allowed to scale with complexity** (do not force convergence): file granularity (single-file → simple → stateful → directory-per-concern, e.g. `validate`); use of `reducers.js` alongside `store.js` for multi-action state (`validate`, `cookie-banner`, `scroll-spy`); presence of `constants.js`.

## The component contract

Most components are **Archetype A**: the default export is a **factory function** with this exact shape. Match it when generating a new per-node component:

```js
// src/index.js
import defaults from './lib/defaults.js';
import factory from './lib/factory.js';
import { getSelection } from './lib/utils.js';

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
- **Import extensions**: relative imports include the explicit `.js` extension (`./lib/defaults.js`), or `/index.js` for a directory module. Required by Node's native ESM, which the `node:test` runner loads source under; microbundle and rspack accept them too.
- **Settings precedence**: always merge in the order `{ ...defaults, ...options, ...node.dataset }` - each spread overrides the previous, so `data-*` attributes win over `options` passed to init, which win over `defaults`. The `...node.dataset` part is optional and not present on every component; include it only when the component reads `data-*` config, but keep this order when you do.
- **Return value**: always an array of instance objects created with `Object.create(factory(...))`. The factory's return value becomes the instance prototype. **Per-node precondition guard (accepted):** a factory may return a falsy value when a matched node fails an internal markup requirement (e.g. `tabs` returns `false` when no tabs/panels are found); `index.js` then warns and filters that node out. The array length can therefore be shorter than the node count — that is correct, not a contract violation. Warn with the selector named.
- **Instance API shape**: the factory returns an object that always exposes `node`, plus the component's action methods (e.g. toggle exposes `toggle`, `startToggle`). **`getState` is required only for stateful components** — components with a store expose it; genuinely stateless components (e.g. `textarea`, whose only state is the DOM-readable height) do not, and a no-op `getState` is not worth adding. Keep public APIs to a small set of named functions.
- **Defaults** live in `src/lib/defaults.js` as a default-exported object (prefix the file with `/* node:coverage disable */` so it's excluded from V8 coverage; inline exclusions use `/* node:coverage ignore next */`).
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
src/lib/reducers.js     # optional: action-type reducers when state has many transitions
```

The DOM-effects file is `dom.js` by convention; `cookie-banner` uses `ui.js` for the same role as an accepted singleton variant. For a component large enough to warrant it, promote each `lib` file to a directory of the same name (`src/lib/validator/`, `src/lib/factory/`, …) — see `validate`. Match granularity to complexity; don't split a tiny component to look like a big one, or vice versa.

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

- **`node:test`** unit tests in `packages/*/__tests__/unit/` as `*.test.js` (Node's built-in runner, `node:assert/strict` assertions). A DOM is supplied per test-file process by the shared `tools/test-setup.mjs` via `--import` (happy-dom, registered with `@happy-dom/global-registrator`); coverage is V8-based, scoped with `--test-coverage-include="src/**"`. Every component has an init suite asserting: the returned array length (a single object for Archetype B), the instance API shape, no-throw when no nodes match, and that `data-*` overrides options.
- **Playwright** e2e + a11y tests in `packages/*/__tests__/playwright/`, using the `Component > Category` describe-block naming (tagged `@all` / `@reduced`). The `Axe` block is required for every component and asserts zero violations; add `Functionality` and, where the component warrants them, `Keyboard` / `Aria` (or component-specific) blocks — only the categories the component actually exercises (`textarea` / `skip` show non-standard sets). Don't ship empty placeholder blocks.
- Both layers are required for any component with DOM/a11y behaviour. **Archetype D** (side-effect modules, e.g. `outliner`/`skip`) may be Playwright-only — the package omits the `node --test` command from its `test` script entirely (node:test has no `--passWithNoTests` and errors on an empty glob), leaving just `npx playwright test`.
- A package's `test` script runs both layers and **must fail if either fails**: chain them with `&&` (`node --test … && npx playwright test`) — do not use a single `&`, which backgrounds the unit run and discards its exit code. The `new-component` skill has the exact test templates and the full `node --test` invocation.

## Code style

Linted by **oxlint** (config in `.oxlintrc.json`) — run `npm run lint` (or `npm run lint:fix` to autofix) before committing. The config turns on the `correctness` category as errors plus a few explicit rules (`eqeqeq`, `no-var`, `no-console` allowing only `warn`/`error`, `no-eval` and friends); `no-console` is relaxed to off inside `**/__tests__/**`. Observed conventions not enforced by the linter but kept consistent: ES modules, 4-space indentation, single quotes, semicolons, arrow functions for top-level/pure helpers, and JSDoc-style block comments on exported functions.

**Keep changes minimal and justified.** Add a default, constant, or abstraction only alongside the code that consumes it — no speculative settings for features not yet written, and don't extract a single-use string literal into a named constant. Be able to name what reads each `defaults.js` entry. Don't silently change existing behaviour (e.g. altering an existing default value); if a change alters behaviour, call it out rather than folding it in.

## Git

- Do not add a `Co-Authored-By: Claude` trailer to commits — use a plain commit message.
- Keep commit messages concise: a single short subject line. Don't add long descriptive bodies unless the change genuinely needs explanation.

## Per-package docs

Each package has a `README.md` that is its public npm documentation — keep it accurate when changing behaviour or options, and register new packages in the root `README.md` table.

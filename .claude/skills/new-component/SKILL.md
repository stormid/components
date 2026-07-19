---
name: new-component
description: Scaffold a new @stormid component package in this Lerna monorepo, following the boilerplate contract, store/dom patterns, accessibility requirements, and the node:test + Playwright test structure. Use when adding a new component package to packages/, or when the user asks to create/scaffold/start a new component.
---

# Scaffold a new component

This monorepo publishes small, framework-agnostic JavaScript behaviour components under `@stormid/*`. `packages/boilerplate` is the canonical starting point. Follow the steps below to produce a new package that matches existing conventions. Read `CLAUDE.md` for the component contract and invariants before starting.

## Step 1 — Copy the boilerplate

Copy `packages/boilerplate` to `packages/<name>` (kebab-case). This gives you the correct file structure, rspack/playwright configs, and an example app skeleton. Keep the `.js` extensions on relative imports (required by Node's native ESM, which the `node:test` runner uses).

## Step 2 — Update `package.json`

Set:
- `name`: `@stormid/<name>`
- `description`, `repository` (`.../tree/master/packages/<name>`), `keywords`
- `private`: `false`, `publishConfig.access`: `public`
- the microbundle `--name <camelCaseName>` in the `build` script

Mirror the script block from an existing package (`build` / `dev` / `prod` / `prepare` / `test`). **For `test`, use:**

```
node --test --experimental-test-coverage --test-coverage-include="src/**" --import ../../tools/test-setup.mjs "__tests__/unit/*.test.js" && npx playwright test
```

(use `"__tests__/unit/**/*.test.js"` if you nest unit tests in sub-directories). Chain with `&&`, not a single `&` (a lone `&` backgrounds the unit run on POSIX and discards its exit code). **Archetype D** (no unit tests) uses just `npx playwright test`.

**Assign a unique dev-server port** in `tools/playwright.rspack.config.js` (`devServer.port`) — packages must not share one, since `lerna run test` runs their Playwright suites concurrently. `tools/playwright/config.base.js` carries a `// CURRENT MAX PORT NUMBER IN USE: NNNN` marker; use `NNNN + 1` and bump the marker.

Leave the copied `.npmignore` as-is — it already excludes `playwright.config.js` and the other build-time files from the published package.

## Step 3 — Implement the source

First identify the **archetype** (see CLAUDE.md): most new components are **A — per-node augmentation** and follow the contract below. **B** (shared state across nodes), **C** (singleton), and **D** (side-effect module) deliberately diverge — if yours is one of those, follow the matching existing component (`scroll-spy`, `cookie-banner`, `skip`) instead of forcing the Archetype A shape.

For Archetype A, keep the factory contract from `src/index.js` (default export → `getSelection` → warn-and-return on no match → `nodes.map(node => Object.create(factory({ settings: { ...defaults, ...options, ...node.dataset }, node })))`). Note the merge order: `defaults → options → dataset` (data attributes win). A factory may return a falsy value to skip a node whose required markup is missing (`index.js` warns and filters it out).

- **Stateless / simple component**: implement behaviour in `src/lib/factory.js`, options in `src/lib/defaults.js`, helpers in `src/lib/utils.js`. See `packages/boilerplate`.
- **Stateful component**: add `src/lib/store.js` (the minimal `createStore`), `src/lib/dom.js` (listeners + effect functions), and `src/lib/constants.js`. Use `packages/toggle` as the reference — note how `factory.js` builds the store, derives state from the DOM, sets initial state with an array of effects, and returns `{ node, getState, ...actions }`.

Keep the implementation minimal and justified (see CLAUDE.md Code style): only add a `defaults.js` entry, constant, or abstraction when the code that consumes it exists — no speculative settings for features you haven't written yet.

**Code style:**

- **Descriptive names** — favour full, meaningful identifiers over vague one- or two-character ones (`query` not `q`, `selectableOptions` not `usable`). The name should say what the value is.
- **Lean comments** — don't narrate what the code already says. In particular, don't describe what each `defaults.js` setting does in code comments: that belongs in the package README's options table, which is the source of truth for consumer-facing option descriptions. Repeating it inline just drifts out of date.
- **Name DOM-element factories with a `create` prefix** — if a component builds its own DOM (as `autocomplete` does), name the `dom.js` functions that create and return an element `createInput`, `createList`, `createStatus`, etc. The bare noun (`input`, `list`) collides with both the element the function returns and its `state.dom` key, and shadows the local variable inside; the verb prefix reads as an action and matches the verb-named effects in the same file (`render*`, `show*`, `sync*`). (Components that only augment existing DOM, like `toggle`, have no such factories.)

Accessibility is mandatory (see CLAUDE.md): keep `aria-expanded` in sync, set `aria-controls`/`role="button"` on triggers, manage and restore focus, and make closed regions keyboard-unreachable. If the component announces results/state through a `role="status"` live region, follow the CLAUDE.md Accessibility rules — don't restate the implicit `aria-live`/`aria-atomic`, and don't announce an option that roving focus already voices.

If the component sources its options from a remote/async endpoint, follow the async pattern in CLAUDE.md *Patterns to follow* (debounce → `AbortController` signal → drop stale responses).

## Step 4 — Write the tests (both layers required)

### Unit (`node:test`) — `__tests__/unit/init.test.js`

Test files live in `__tests__/unit/` and are named `*.test.js`. Use Node's built-in runner and `node:assert/strict`; a DOM (happy-dom) is provided by the shared `tools/test-setup.mjs` (loaded via `--import` in the `test` script), so just use `document` directly. Set up the DOM with `document.body.innerHTML`, init the component, and assert the contract:

```js
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import component from '../../src/index.js';
import { getSelection } from '../../src/lib/utils.js';

describe('Component > Init', () => {
    before(() => {
        document.body.innerHTML = `<div class="js-component"></div>`;
    });

    it('should return an array with one instance per matched node', () => {
        const instances = component('.js-component');
        assert.strictEqual(instances.length, 1);
    });

    it('should expose the expected API', () => {
        const instances = component('.js-component');
        assert.notStrictEqual(instances[0].node, null);
        // getState only for stateful components (those with a store); omit for stateless ones
        assert.notStrictEqual(instances[0].getState, null);
    });

    it('should return without throwing if no DOM nodes are found', () => {
        assert.strictEqual(component('.js-not-found'), undefined);
    });

    it('should use data attributes as settings, overriding options', () => {
        // assert a data-* attribute wins over the same option
    });
});
```

Assertion mapping (Jest → node:assert): `toEqual`→`deepStrictEqual`, `toBe`→`strictEqual`, `not.toBeNull()`→`notStrictEqual(x, null)`, `toBeUndefined()`→`strictEqual(x, undefined)`. Mocks use `mock.fn()` from `node:test` (`fn.mock.callCount()`, `fn.mock.calls[i].arguments`). Add further unit files per concern (`store.test.js`, `events-hooks.test.js`, …) as `toggle` does. The DOM environment doesn't provide `IntersectionObserver`/`ResizeObserver` — stub those at the top of the test file that needs them (see `scroll-points`).

### Playwright — `__tests__/playwright/playwright.spec.js`

Use the `Component > Category` describe-block naming. `Functionality` and the `Axe` block (fixed boilerplate, required) are the always-present blocks; add `Keyboard`, `Aria`, or component-specific blocks only for the behaviour the component actually has — don't ship empty placeholder blocks:

```js
const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Component > Functionality', { tag: '@all' }, () => {
    test('should do the thing', async ({ page }) => {
        // interact and assert visible state / classes
    });
});

// Add further describe blocks for whichever categories apply, following the
// 'Component > Category' naming, e.g.:
//   'Component > Keyboard' - keyboard interaction + focus management
//   'Component > Aria'     - aria attributes staying in sync (aria-controls / aria-expanded)
// Only add what the component actually does. See toggle / modal / tabs for
// interactive examples, or textarea / skip for non-standard categories.

test.describe('Component > Axe', { tag: '@reduced' }, () => {
    test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
```

## Step 5 — Example app

Update `example/src/index.html` and `example/src/js/index.js` to demonstrate the component (the Playwright tests run against this app via rspack). Cover each configurable option in the markup so tests have something to target.

Keep the example page visually consistent with the other packages: reuse boilerplate's shared `<style>` block and its `<main>` → `.container` layout wrapper rather than hand-rolling a different reset or bespoke CSS. Copy the shared styling (`.container`, `.form`, `.input`, `.btn`, `.label`, …) from boilerplate or the closest existing example and add only component-specific rules on top. If you use a layout class like `.container`, make sure its rule is actually present — don't reference it without defining it.

## Step 6 — Docs and registration

- Write `packages/<name>/README.md` (public npm docs): what it does, install, usage, options table, instance API. Match the tone/structure of existing package READMEs.
- Add a row for the package in the root `README.md` table.

## Step 7 — Verify

```
lerna run test --scope=@stormid/<name>
npm run lint:fix
lerna run dev --scope=@stormid/<name>   # sanity-check the example app
```

All unit (`node:test`) and Playwright tests (including the Axe block) must pass before the package is considered done.

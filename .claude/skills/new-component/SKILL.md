---
name: new-component
description: Scaffold a new @stormid component package in this Lerna monorepo, following the boilerplate contract, store/dom patterns, accessibility requirements, and the Jest + Playwright test structure. Use when adding a new component package to packages/, or when the user asks to create/scaffold/start a new component.
---

# Scaffold a new component

This monorepo publishes small, framework-agnostic JavaScript behaviour components under `@stormid/*`. `packages/boilerplate` is the canonical starting point. Follow the steps below to produce a new package that matches existing conventions. Read `CLAUDE.md` for the component contract and invariants before starting.

## Step 1 — Copy the boilerplate

Copy `packages/boilerplate` to `packages/<name>` (kebab-case). This gives you the correct file structure, webpack/playwright/jest configs, and an example app skeleton.

## Step 2 — Update `package.json`

Set:
- `name`: `@stormid/<name>`
- `description`, `repository` (`.../tree/master/packages/<name>`), `keywords`
- `private`: `false`, `publishConfig.access`: `public`
- the microbundle `--name <camelCaseName>` in the `build` script

Mirror the script block from an existing package (`build` / `dev` / `prod` / `prepublish` / `test`).

## Step 3 — Implement the source

Keep the factory contract from `src/index.js` (default export → `getSelection` → warn-and-return on no match → `nodes.map(node => Object.create(factory({ settings: { ...defaults, ...options, ...node.dataset }, node })))`).

- **Stateless / simple component**: implement behaviour in `src/lib/factory.js`, options in `src/lib/defaults.js`, helpers in `src/lib/utils.js`. See `packages/boilerplate`.
- **Stateful component**: add `src/lib/store.js` (the minimal `createStore`), `src/lib/dom.js` (listeners + effect functions), and `src/lib/constants.js`. Use `packages/toggle` as the reference — note how `factory.js` builds the store, derives state from the DOM, sets initial state with an array of effects, and returns `{ node, getState, ...actions }`.

Accessibility is mandatory (see CLAUDE.md): keep `aria-expanded` in sync, set `aria-controls`/`role="button"` on triggers, manage and restore focus, and make closed regions keyboard-unreachable.

## Step 4 — Write the tests (both layers required)

### Jest — `__tests__/jest/init.js`

Set up the DOM with `document.body.innerHTML`, init the component, and assert the contract:

```js
import component from '../../src';
import { getSelection } from '../../src/lib/utils';

describe('Component > Init', () => {
    beforeAll(() => {
        document.body.innerHTML = `<div class="js-component"></div>`;
    });

    it('should return an array with one instance per matched node', () => {
        const instances = component('.js-component');
        expect(instances.length).toEqual(1);
    });

    it('should expose the expected API', () => {
        const instances = component('.js-component');
        expect(instances[0].node).not.toBeNull();
        expect(instances[0].getState).not.toBeNull();
    });

    it('should return without throwing if no DOM nodes are found', () => {
        expect(component('.js-not-found')).toBeUndefined();
    });

    it('should use data attributes as settings, overriding options', () => {
        // assert a data-* attribute wins over the same option
    });
});
```

Add further Jest files per concern (e.g. `store.js`, `events-hooks.js`, `state-from-dom.js`) as toggle does.

### Playwright — `__tests__/playwright/playwright.spec.js`

Use the standard describe-block structure. The `Axe` block is fixed boilerplate and is required:

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

test.describe('Component > Keyboard', { tag: '@all' }, () => {
    // keyboard interaction + focus management tests (if applicable)
});

test.describe('Component > Aria', { tag: '@all' }, () => {
    test('should keep aria attributes in sync', async ({ page }) => {
        // assert aria-controls / aria-expanded
    });
});

test.describe('Component > Axe', { tag: '@reduced' }, () => {
    test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
```

## Step 5 — Example app

Update `example/src/index.html` and `example/src/js/index.js` to demonstrate the component (the Playwright tests run against this app via webpack). Cover each configurable option in the markup so tests have something to target.

## Step 6 — Docs and registration

- Write `packages/<name>/README.md` (public npm docs): what it does, install, usage, options table, instance API. Match the tone/structure of existing package READMEs.
- Add a row for the package in the root `README.md` table.

## Step 7 — Verify

```
lerna run test --scope=@stormid/<name>
npm run lint -- --fix
lerna run dev --scope=@stormid/<name>   # sanity-check the example app
```

All Jest and Playwright tests (including the Axe block) must pass before the package is considered done.

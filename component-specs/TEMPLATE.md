# Component requirements: <name>

> Copy this file to `component-specs/<name>/requirements.md` and fill it in.
> `<name>` is the kebab-case package name (published as `@stormid/<name>`).
> The `/generate-component` skill reads this file. Leave a field as "recommend"
> to have the planning stage decide it for you; don't invent detail you don't need.

## Purpose

One or two sentences: what the component does and the problem it solves.

## Archetype

`A` / `B` / `C` / `D`, or `recommend`. (A = per-node augmentation (default);
B = shared state across nodes; C = singleton; D = side-effect module. See CLAUDE.md
"Component archetypes".)

## Behaviour

Bullet the interactions and what happens on each — concrete about DOM changes,
state transitions, and edge cases (empty input, missing target, rapid repeat, etc.).

## Options

| Option | Type | Default | Read from `data-*`? | Description |
| --- | --- | --- | --- | --- |
|  |  |  | yes/no |  |

## Events dispatched

CustomEvents fired from the node (name, when it fires, `detail` shape), or `none`.

## Accessibility

Focus behaviour, ARIA attributes to keep in sync, live-region announcements,
keyboard interaction. Write `standard for archetype` if nothing beyond the contract
applies.

## Async / remote data

Does it fetch options/data? If so, describe the source and the consumer search-fn
shape. Otherwise `none`.

## Example-app scenarios

What the `example/` app should demonstrate so Playwright has targets — one bullet
per configuration worth showing.

## Acceptance criteria

Numbered, testable statements. Each becomes a row the post-generation review traces
to a specific test.

1.
2.

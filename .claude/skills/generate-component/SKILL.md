---
name: generate-component
description: End-to-end pipeline to generate a new @stormid component from a requirements spec — plans it, reviews the plan against the requirements, gates on human approval, scaffolds via the new-component skill, then reviews the generated code against the requirements. Also re-runs against updated requirements with minimal churn. Use when the user runs /generate-component, or asks to generate/build a component from a requirements file/spec.
---

# Generate a component from a requirements spec

This orchestrates the whole lifecycle of adding a component to this monorepo, from a written requirements file through planning, human approval, scaffolding, and verification. It **builds on** the `new-component` skill (which owns the scaffold recipe) and the `CLAUDE.md` contract — read both; this skill does not restate their rules.

**Invocation:** `/generate-component <name>` where `<name>` is the kebab-case package name (published as `@stormid/<name>`).

## Inputs and layout

Requirements and the generated plan live in a top-level, version-controlled folder, one per component:

```
component-specs/
  README.md              # how to author a spec and run the pipeline
  TEMPLATE.md            # copy this to start a new spec
  <name>/
    requirements.md      # human-authored input (the source of truth for intent)
    requirements.lock.md # snapshot of the requirements the component was last generated from
    plan.md              # the approved implementation plan
    manifest.json        # archetype, port, generated-file list, dates
```

Top-level (not inside `packages/<name>/`) on purpose: the packages' `.npmignore` files use exclude-lists with no `files` whitelist, so anything added inside a package would be published. Keeping specs at the root sidesteps that and keeps every spec browsable in one place.

## Mode detection (first thing)

Read `component-specs/<name>/manifest.json`.
- **Missing → create mode** (Steps 1–8 below).
- **Present → update mode** (jump to *Update mode* at the end).

If `component-specs/<name>/requirements.md` does not exist, tell the user to author one from `component-specs/TEMPLATE.md` and stop.

---

## Step 1 — Intake

Read `component-specs/<name>/requirements.md`, `CLAUDE.md`, and the `new-component` skill.

Check the spec is complete enough to plan: purpose, archetype (or "recommend"), behaviour, options, events, accessibility, async-data, example scenarios, acceptance criteria. If a section is blank or ambiguous **in a way that changes the design** (not merely a detail the planning stage can reasonably decide), ask the user focused clarifying questions with `AskUserQuestion` before continuing. Do not invent behaviour the spec doesn't call for.

## Step 2 — Plan

Produce a concrete implementation plan and write it to `component-specs/<name>/plan.md`. It must state:

- **Archetype** (A/B/C/D) and why — this drives which contract rules apply.
- **File structure** under `src/` (match granularity to complexity per CLAUDE.md; don't over-split a simple component).
- **`defaults.js` entries** — each one named against the requirement/option that consumes it (no speculative settings).
- **State & effects** (stateful only): state shape, the store, the effect functions dispatched on each transition.
- **Events** dispatched (name in `constants.js`, `detail` shape).
- **Accessibility model**: which ARIA attributes sync with what, focus management, live-region model (roving focus vs `aria-activedescendant` — pick one, no double-announce).
- **Test matrix**: the `node:test` files (init suite + `Component > Initialisation` / `> Get Selection`, layer backbone `store.test.js`/`utils.test.js`, per-feature files) and the Playwright blocks (`Functionality`, `Axe`, plus `Keyboard`/`Aria` only where the component warrants). Map each **acceptance criterion** to the test that will prove it.
- **Example-app scenarios** to demonstrate each option.
- **Dev-server port** to claim: read the `// CURRENT MAX PORT NUMBER IN USE: NNNN` marker in `tools/playwright/config.base.js` and plan to use `NNNN + 1`.

## Step 3 — Review the plan

Spawn **one** review subagent (the `Agent` tool, `Plan` or `general-purpose` type) to check the plan against the requirements before the human sees it. Give it the paths to `component-specs/<name>/requirements.md`, `component-specs/<name>/plan.md`, `CLAUDE.md`, and the `new-component` skill, and ask it to return:

- a **traceability matrix**: each requirement / option / event / acceptance criterion → `covered` / `partial` / `missing`, with the plan section as evidence;
- **issues** by severity (blocker / major / minor) with a concrete fix each — covering requirements gaps, CLAUDE.md contract/archetype violations, accessibility omissions, and any planned behaviour the spec never asked for;
- an **overall verdict**: `fail` if any requirement is missing or any blocker exists, else `concerns`/`pass`.

**Fold every blocker and reasonable major finding back into `plan.md`** before the human sees it; if the verdict is `fail`, revise and re-review until it isn't. Briefly summarise for the user what the review changed.

## Step 4 — Human gate

Present the reviewed plan for approval using **plan mode** (`ExitPlanMode`) — this is the human-in-the-loop checkpoint. Include the traceability matrix (requirement → where the plan satisfies it) so the reviewer can confirm coverage. Do not generate anything until the plan is approved. If the user requests changes, revise `plan.md` (re-running Step 3 if the change is substantial) and re-present.

## Step 5 — Generate

With the plan approved, scaffold the component by following the **`new-component`** skill end-to-end against the approved `plan.md`: copy boilerplate, set `package.json`, claim the planned port (and bump the marker), implement the source, write both test layers, build the example app, write `README.md`, and register the package in the root `README.md` table.

## Step 6 — Verify (mechanical)

```
lerna run test --scope=@stormid/<name>
npm run lint:fix
```

Both test layers (including the Axe block) must pass. Fix failures before continuing; report honestly if something can't be made to pass rather than papering over it.

## Step 7 — Review the generated code

Spawn **one** review subagent again, this time pointed at the generated package. Give it the paths to `requirements.md`, the approved `plan.md`, `CLAUDE.md`, and the source and test files under `packages/<name>/`, and ask it to verify the code and tests against all three and return a **traceability matrix** (each requirement → implementing file:line → the proving test), issues by severity, and an overall verdict. Apply blocker/major fixes, re-run Step 6, and iterate until the verdict is `pass`. Then present the final matrix to the user.

## Step 8 — Record

- Copy `requirements.md` to `component-specs/<name>/requirements.lock.md` (the snapshot the component was generated from).
- Write `component-specs/<name>/manifest.json`:

```json
{
  "name": "<name>",
  "archetype": "A",
  "port": 0000,
  "generatedFiles": ["packages/<name>/src/index.js", "..."],
  "createdDate": "YYYY-MM-DD",
  "lastUpdatedDate": "YYYY-MM-DD",
  "planSummary": "one line"
}
```

Use today's date from context for the dates. Do not commit unless the user asks (and never add a Co-Authored-By trailer — see CLAUDE.md Git).

---

## Update mode (re-run against changed requirements)

Triggered when `manifest.json` already exists. Goal: absorb requirement changes **without needlessly changing untouched code**.

1. **Diff** current `requirements.md` against `requirements.lock.md`. If identical, tell the user there's nothing to do and stop.
2. **Scope a change plan** covering *only* the delta: which options, behaviours, events, a11y items, and tests the changed requirements add/alter/remove, and the specific files/functions each touches. Explicitly note what stays untouched. Write it to `plan.md` (keep the prior plan's still-valid sections).
3. **Review the change plan** with a review subagent (as in Step 3) and fold findings in.
4. **Human gate** on the change plan via `ExitPlanMode`.
5. **Apply as targeted edits** — use `Edit` on the affected files; do **not** re-scaffold from boilerplate or rewrite files the delta didn't touch. Update the README options table and example app only where the change requires it.
6. **Verify** (Step 6) and **review the code** (Step 7, `mode: 'code'`).
7. **Record**: refresh `requirements.lock.md`, bump `lastUpdatedDate`, and update `generatedFiles`/`planSummary` in the manifest.

The lockfile + edit-in-place approach is what keeps re-runs minimal: the diff bounds the work, and nothing outside the delta is rewritten.

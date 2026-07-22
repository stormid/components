# Component specs

Requirements-driven pipeline for adding a component to this monorepo. Each folder here holds the requirements for one component and the artefacts the pipeline produces from them. The pipeline itself is the **`generate-component`** Claude Code skill (`.claude/skills/generate-component/`), which builds on the `new-component` skill and the root `CLAUDE.md` contract.

## Layout

```
component-specs/
  README.md              # this file
  TEMPLATE.md            # copy this to start a new spec
  <name>/
    requirements.md      # you write this — the source of truth for intent
    requirements.lock.md # generated — snapshot the component was last built from
    plan.md              # generated — the approved implementation plan
    manifest.json        # generated — archetype, port, file list, dates
```

Specs live here (not inside `packages/<name>/`) so they never end up in the published npm package, and so every component's intent is browsable in one place.

## Creating a component

1. Copy `TEMPLATE.md` to `component-specs/<name>/requirements.md` and fill it in (`<name>` is the kebab-case package name).
2. Run `/generate-component <name>` in Claude Code.
3. The pipeline will:
   - read the requirements, `CLAUDE.md`, and the `new-component` skill, asking clarifying questions if the spec is ambiguous in a way that changes the design;
   - draft an implementation plan and review it against the requirements;
   - **present the plan for your approval** (plan mode) — nothing is written until you approve;
   - scaffold the package (code, `node:test` unit tests, Playwright + Axe tests, README, root-table registration) via the `new-component` recipe;
   - run the tests and lint, then review the generated code against the requirements and plan, showing you a requirement-by-requirement traceability matrix.

## Updating a component

When requirements change, edit `component-specs/<name>/requirements.md` and run `/generate-component <name>` again. Because a `manifest.json` already exists, the pipeline runs in **update mode**: it diffs your edits against `requirements.lock.md`, plans only the delta, gets your approval, and applies targeted edits — it does not re-scaffold or rewrite code the change didn't touch.

## Notes

- The human-approval gate uses plan mode, so run the skill in an interactive session.
- The plan- and code-review stages each use a single review subagent.
- Don't hand-edit `requirements.lock.md`, `plan.md`, or `manifest.json` — the pipeline owns them.

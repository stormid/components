# Component requirements: postcode-lookup

> Copy this file to `component-specs/<name>/requirements.md` and fill it in.
> `<name>` is the kebab-case package name (published as `@stormid/<name>`).
> The `/generate-component` skill reads this file. Leave a field as "recommend"
> to have the planning stage decide it for you; don't invent detail you don't need.

## Purpose

Progressively enhances a UK postcode field so a user can look up their address, pick
it from a results list, and have the individual address fields populated for them —
with a manual-entry fallback when the lookup fails or the user prefers to type it in.
Solves the "type your whole address by hand" burden while keeping a fully usable,
accessible experience without JavaScript.

## Archetype

`A` — per-node augmentation. Each `.js-postcode-lookup` node is enhanced
independently (its own input, button, results list, manual fields and state). No
state is shared between instances, so the module iterates `els` and wires each one in
isolation.

## Behaviour

- **Search trigger.** Clicking the "Find address" button, or pressing `Enter` in the
  postcode input, runs a lookup. `Enter` must `preventDefault()` so it never submits
  the surrounding form.
- **Client-side pre-validation** (before any network call):
  - Empty/whitespace input → show error "Enter a valid UK postcode." and return.
  - Value fails the configured postcode pattern → same error and return.
- **De-duplication.** If the trimmed query equals the last successful search, do
  nothing (no repeat request, no list rebuild).
- **In-flight state.** While a request is pending, disable the button and set
  `aria-busy="true"` on the results region so repeat submissions are blocked and AT
  users are told a search is running. Re-enable and clear busy on settle (success or
  failure).
- **Results rendering.** On success, clear previous results (keep the placeholder
  option), append one `<option>` per match whose visible text is the joined address
  and whose `data-*` attributes carry the structured parts (`addressLine1`,
  `addressLine2`, `town`, `postcode`). Reveal the results list (`hidden` removed) and
  move focus to it. Announce the count in a live region ("N addresses found" / "1
  address found").
- **Prefill / round-trip.** On first run, if a match equals the server-provided
  initial value, mark that option selected so a saved address survives a page reload
  without re-selecting.
- **Selection.** Changing the results list copies the selected option's `data-*`
  parts into the (hidden) manual address fields; selecting the placeholder clears
  them.
- **No / failed results.** Reveal an inline error: "We could not find any addresses
  for the postcode '{value}'. Make sure you have entered a valid UK postcode." Keep
  focus recoverable and the button usable for a retry. A network/parse failure is
  reported the same way (logged to console at `warn`).
- **Manual toggle.** A toggle switches between "search by postcode" and "type in full
  address":
  - Opening manual: hide the search wrapper; if no address is currently selected,
    clear the input, reset the list to placeholder and hide it; swap validation from
    the postcode field to the manual fields and attach required rules.
  - Closing manual: reveal the search wrapper; if the typed manual values no longer
    match the selected option, reset the list/input; swap validation back to the
    postcode field, detach manual required rules, and return focus to the input.
- **Manual required-field dependency.** When Address Line 1 has a value, City/Town and
  Postcode become required; when it is cleared, that requirement is removed. Re-run
  real-time validation if it is enabled.
- **Reset guard.** If every manual field is emptied (on blur), reset the results list
  back to its placeholder so a stale selection can't be submitted.
- **Postcode normalisation.** On blur, trim and upper-case the manual postcode field.
- **Cross-field ("either/or") re-sync.** After selection or toggling, re-fire input
  events on `data-val-or` fields so group validators re-evaluate.

## Options

| Option | Type | Default | Read from `data-*`? | Description |
| --- | --- | --- | --- | --- |
| `search` | `(query: string) => Promise<Address[]>` | required (no default) | no (JS config) | Consumer-supplied lookup fn. Decouples the component from any specific endpoint (replaces the hard-coded `/api/addresses`). Rejects/throws to signal failure. |
| `validator` | validator instance | required | no | External form-validator the component registers/removes rules against. |
| `pattern` | `string` (RegExp source) | none (skip pattern check) | yes — `data-val-regex-pattern` on the input | Client-side UK-postcode pattern used before calling `search`. |
| `startOpen` | `boolean` | `false` | yes — `data-start-open` on the manual fieldset | Start in manual-entry mode with manual required rules attached. |
| `minLength` | `number` | `recommend` | yes — `data-min-length` | Minimum trimmed length before a search is allowed. |
| `messages` | `{ empty, invalid, notFound, select }` | built-in English strings | no | Overridable user-facing copy. |

`Address` shape: `{ addressLine1: string, addressLine2?: string, town?: string, postcode: string }`.

## Events dispatched

- `address.found` — dispatched from the results-list wrapper node after options are
  rendered. Bubbles. `detail: { fields: [selectElement] }`. Lets the host form hook
  the newly populated select into validation/other listeners.

  (Recommend also adding, and documenting, `address.selected` with
  `detail: { address: Address }` on `change`, and `address.error` with
  `detail: { type: 'empty' | 'invalid' | 'notFound' | 'network', query }` — the
  current component fires neither, which makes it hard to observe from outside.)

## Accessibility

The current implementation has gaps this component must fix:

- **Live announcements.** The error text node and the results list must be exposed as
  live regions. Errors: `role="alert"` (assertive). Result count + "no results":
  polite `role="status"` / `aria-live="polite"`. Focus moving to the list is not
  enough on its own — announce the count.
- **`aria-describedby` composition.** When associating the error message, *append* its
  id to any existing `aria-describedby` (e.g. a help hint) rather than overwriting it;
  remove only that id when the error clears. Never clobber pre-existing descriptions.
- **`aria-invalid` lifecycle.** Set `aria-invalid="true"` on error, back to `"false"`
  (and drop the error describedby id) on a successful search.
- **Busy state.** Expose `aria-busy="true"` on the results region while `search` is
  pending; the disabled button alone gives no AT feedback.
- **Keyboard.** Use `keydown` (not deprecated `keypress`); `Enter` in the input
  triggers the search and does not submit the form. Button and toggles are real
  `<button type="button">`. Focus order stays logical after the list is revealed and
  after each toggle (return focus to the input when closing manual entry).
- **Labelling.** Results `<select>` has an associated `<label>` and a meaningful,
  non-empty placeholder option (e.g. "Select an address"). Manual inputs keep their
  `<label>`s and belong to a `<fieldset>`/`<legend>`.
- **Autofill.** Postcode input carries `autocomplete="postal-code"`; manual fields
  carry the matching `address-line1` / `address-line2` / `address-level2` /
  `postal-code` tokens.
- **Toggle button naming.** The manual/search toggle exposes an accessible name that
  states the action (e.g. `aria-label="Enter address manually"` /
  `"Search for address using postcode"`).

## Async / remote data

Yes. The component fetches address matches for a postcode, but **must not hard-code a
URL**. The consumer passes a `search` fn: `(query: string) => Promise<Address[]>`
that resolves to an array of `Address` objects (empty array ⇒ "no results" path) and
rejects/throws on network or parse failure. This is the standard `@stormid` consumer
search-fn shape and keeps the package endpoint-agnostic and testable.

## Example-app scenarios

- Default lookup: type a valid postcode, Find address, pick from the list, assert the
  (revealed) manual fields are populated and `address.found` fired.
- No results: a postcode the stub `search` returns `[]` for → assert the "not found"
  message is announced via the status region.
- Invalid input: empty submit and pattern-fail submit → assert the alert message and
  `aria-invalid="true"`.
- Network failure: `search` rejects → assert the failure message and the button
  re-enables for retry.
- Manual toggle both ways: open manual (search hidden, manual required rules on),
  close manual (search restored, focus back on input).
- Prefill round-trip: instance rendered with an initial saved value → assert the
  matching option is pre-selected on first search.
- `data-start-open`: instance that boots straight into manual mode.

## Acceptance criteria

1. Pressing `Enter` in the postcode input runs a search and does **not** submit the form.
2. Submitting an empty/whitespace postcode shows the "enter a valid UK postcode"
   message, sets `aria-invalid="true"`, and makes no `search` call.
3. Submitting a value that fails `pattern` shows the invalid message and makes no
   `search` call.
4. A successful `search` renders one option per match with structured `data-*` parts,
   reveals the list, and announces the result count via a polite live region.
5. Re-submitting the same trimmed query does not trigger a second `search` call or
   rebuild the list.
6. While `search` is pending the button is disabled and the results region has
   `aria-busy="true"`; both clear on settle (success or failure).
7. Selecting an option populates Address Line 1/2, Town and Postcode from its `data-*`
   parts; selecting the placeholder clears them.
8. `search` returning `[]` or rejecting shows the "not found" message announced via a
   live region, and the button re-enables for retry.
9. The error message id is appended to (not substituted for) any existing
   `aria-describedby`, and is removed again when the error clears.
10. Opening manual entry hides the search UI and attaches manual required rules;
    closing it restores the search UI, detaches those rules, and returns focus to the
    postcode input.
11. When Address Line 1 has a value, Town and Postcode are required; clearing Line 1
    removes that requirement.
12. Emptying all manual fields resets the results list to its placeholder option.
13. `address.found` bubbles from the results wrapper with `detail.fields` containing
    the results `<select>` after rendering.
14. A saved initial value matching a returned address is pre-selected on first search.
15. The component reads its endpoint from the injected `search` fn only — no URL is
    hard-coded in the package.

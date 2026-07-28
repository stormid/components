# Autocomplete

An accessible, framework-agnostic autocomplete/combobox. Enhances an element into a
WAI-ARIA combobox with a listbox popup, supporting single or multiple selection, a
synchronous or asynchronous (remote) option source, and progressive enhancement of a
native `<select>` or a server-rendered `<input>`.

---

## Usage

Install the package

```
npm i -S @stormid/autocomplete
```

Import the module and initialise against a selector, a node, a NodeList or an array of nodes:

```js
import autocomplete from '@stormid/autocomplete';

autocomplete('.js-autocomplete', {
    name: 'fruit',
    search(query){
        return fruits.filter(fruit => fruit.label.toLowerCase().includes(query.toLowerCase()));
    }
});
```

Pass at least a `name` so the selection is submitted, and either a `search` function or a
`values` array so there are options to choose from. Everything else has a sensible
default — see [Options](#options).

The visible input is display/search only; the submitted value is carried by a hidden
field (single mode) or one hidden field per chip (multiple mode), so `displayTemplate` can
show a label while the form receives the `submissionTemplate`.

Any option can also be set with a `data-*` attribute on the node. Precedence is
`defaults → options → data-*`, so a `data-*` attribute wins over an option passed to init.

### Asynchronous (remote) source

The most common setup is searching a remote API. Set `async: true` and return a Promise
from `search`. Requests are debounced (so the API is hit once the user pauses, not on every
keystroke), a loading message is announced while a request is in flight, and stale
responses from superseded queries are discarded.

`debounceDelay` sets how long that pause is, in milliseconds (200 by default). Raise it for
an expensive or rate-limited endpoint, lower it for a fast one. It applies to `async` mode
only — a synchronous `search` runs on every keystroke.

`search` receives the query and an `AbortSignal` as its second argument — pass it to
`fetch` so an in-flight request is cancelled when a newer keystroke supersedes it. Map the
API's response shape to the options your `displayTemplate`/`submissionTemplate` expect:

```js
autocomplete('.js-autocomplete', {
    name: 'country',
    async: true,
    //show the country name, submit the country code
    displayTemplate: option => option.label,
    submissionTemplate: option => option.value,
    search(query, signal){
        return fetch(`/api/countries?q=${encodeURIComponent(query)}`, { signal })
            .then(res => {
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                return res.json();
            })
            //map the API's { code, name } rows to the { value, label } shape options use
            .then(rows => rows.map(row => ({ value: row.code, label: row.name })));
    }
});
```

A rejected request (other than an abort) is caught and treated as an empty result, so the
component shows the `noResultsMsg` rather than throwing. `async` is orthogonal to the mode —
it works with single and multiple selection alike.

### Multiple selection

Set `multiple: true` to accumulate selections as removable chips, each submitting its value
under a repeated `name`:

```js
autocomplete('.js-autocomplete', { name: 'fruits', multiple: true, search });
```

Once an option is chosen it is hidden from the list, so it can't be selected twice and
the dropdown only ever offers what's still available. Removing its chip (or `clear()`)
brings it back.

Adding or removing a selection is announced in the live region (`selectionAddedMsg` /
`selectionRemovedMsg`), so the change is heard as well as seen — a chip appearing or
disappearing is otherwise a purely visual cue. That's distinct from `selectionMsg`, the
visually-hidden summary linked via `aria-describedby`, which reports the whole selection
when the input is refocused.

Each selection is submitted under the same `name`, so a form post serialises them as
repeated pairs (`fruits=apple&fruits=banana`) — every value is sent, none is overwritten.
Whether your server exposes them as an array depends on how it parses the body:
Node/Express, Java and ASP.NET collection binding give an array from a repeated name, but
**PHP and Ruby/Rails keep only the last value** unless you use bracket notation. The `name`
is applied verbatim, so pass `name: 'fruits[]'` if your backend needs it. Client-side,
`new FormData(form).getAll('fruits')` returns every value (`.get()` returns only the first).

### Progressive enhancement from `<select>`

Wrap a `<select>` and its options, `name` and `multiple` are adopted, pre-selected
`<option>`s seed the initial selection, and the `<select>` is removed:

```html
<div class="js-autocomplete">
    <select name="fruit">
        <option value="">Choose a fruit</option>
        <option value="apple">Apple</option>
        <option value="banana" selected>Banana</option>
    </select>
</div>
```

### Progressive enhancement from an `<input>`

For a **search / free-text** field, ship a real `<input>` and the component enhances that
element in place rather than generating one — so the field works and submits before (and
without) JavaScript:

```html
<form action="/search" method="get">
    <label for="q">Search</label>
    <div class="js-autocomplete">
        <input type="search" id="q" name="q">
    </div>
</form>
```

```js
autocomplete('.js-autocomplete', { submitOnConfirm: true, search });
```

The input's `id` (so an existing `<label for>` stays associated), its `name` and any current
`value` are adopted: the name moves onto the hidden value field so the field isn't submitted
twice, and the value is restored as the initial selection (exactly like `data-value`). An
explicit `name`/`value` option still wins. Pair with `submitOnConfirm` (and usually
`allowFreeText`) for a search box, so the typed query submits with or without JS.

This is the graceful-degradation path for **single-value, search-style** fields. A field that
must be constrained to a fixed list has no meaningful no-JS control other than a `<select>`,
so use the [`<select>` enhancement](#progressive-enhancement-from-select) above for those; an
`async`/remote source can't degrade (its options only exist once the script has fetched them).
In **multiple** mode a single `<input>` can't carry several values without JS, so it degrades
to a plain search field — any server value is left as typed text, not turned into a chip.
Restore multiple selections with `<select multiple>` or the `value` array option instead.

### Custom option template

`displayTemplate` maps an option to the single line of text shown in the input, chips and
list. To show richer content in the **list only** — for example a second detail line —
supply an `optionTemplate`. It renders each list option (falling back to `displayTemplate`
when omitted) and may return markup built with the exported **`html`** tag or a DOM node,
so the list can carry markup the display label and submitted value don't.

`html` is a tagged template that leaves your own tags untouched and escapes every `${…}`
value — the escaping happens at the interpolation points, not on the whole string, since
the string's own tags are intentional markup. Option data from an API therefore can't
inject markup, with no manual escaping in the template:

```js
import autocomplete, { html } from '@stormid/autocomplete';

autocomplete('.js-autocomplete', {
    name: 'airport',
    displayTemplate: option => option.label,      // input / chips show the name
    submissionTemplate: option => option.value,   // form submits the code
    //list shows the name plus a second detail line; option.label/detail are escaped
    optionTemplate: option => html`
        <span class="title">${option.label}</span>
        <small class="detail">${option.detail}</small>
    `,
    search
});
```

Only what the `html` tag returns is treated as markup. It hands back a branded value
rather than a plain string, and that brand is what the renderer checks — so an ordinary
string is always set as `textContent`, however it was built. A template that assembles
tags by hand renders them as visible text:

```js
optionTemplate: option => `<span>${option.label}</span>`
//                       ^ shows the literal text "<span>Heathrow</span>"
```

Forgetting to escape is then a rendering bug that can be seen immediately, rather than an XSS hole on whatever the option data contains. Wrap it in `html` and it renders as markup, escaped.

Alternatively return a DOM node you build — its `textContent` is set safely, so it needs
no escaping and is a good fit when the markup is dynamic or the values are wholly untrusted:

```js
optionTemplate(option){
    const title = document.createElement('span');
    title.textContent = option.label;
    const detail = document.createElement('small');
    detail.textContent = option.detail;
    const wrap = document.createElement('span');
    wrap.append(title, detail);
    return wrap;
}
```

So an option's content becomes markup in exactly two cases: a DOM node, or `html` output.
Everything else — including the `displayTemplate` fallback — is rendered as plain text.

The lower-level `escapeHtml` is still exported for escaping values by hand, but it isn't
needed inside an `html` template (which escapes for you) and it can't make a plain string
render as markup.

### Submitting on confirm (search box)

By default, choosing a suggestion commits it and keeps the user on the page. For a
search-style autocomplete — where choosing a suggestion should *go* somewhere — set
`submitOnConfirm: true`. Confirming an option (by click or Enter) then commits it and
submits the enclosing `<form>`, so the chosen value is posted / navigated to. Pressing Enter
with nothing highlighted submits the raw typed query, exactly like a plain search box:

```html
<form action="/search" method="get">
    <label for="q">Search</label>
    <div class="js-autocomplete" id="q"></div>
</form>
```

```js
autocomplete('.js-autocomplete', { name: 'q', submitOnConfirm: true, search });
```

The component submits the form via `requestSubmit()`, so any native validation and your
`submit` handler still run. A Tab or blur commit never submits — only an explicit
confirmation navigates. Pair it with `allowFreeText` if the raw query should be submitted
as the field value when no option is picked. If the component isn't inside a form,
`submitOnConfirm` simply commits the selection as usual.

### Input attributes

Four attributes on the generated input are exposed as settings, so a field can be tuned to
what it's actually searching:

| Setting | Effect |
| --- | --- |
| `spellcheck` | Spellchecking. **Off by default** — see below. |
| `inputmode` | Virtual keyboard on touch devices: `search` gives a "Search" action key, `numeric` a digit pad for a postcode or reference lookup, and `email`/`tel`/`url` their respective layouts. Doesn't affect the value or validation. |
| `autocorrect` | `off` stops iOS "correcting" a deliberately typed surname or code mid-search. Safari only. |
| `autocapitalize` | `none` stops mobile keyboards capitalising the first letter — worth setting when searching lowercase usernames, emails or codes. |

```js
autocomplete('.js-autocomplete', { name: 'postcode', inputmode: 'numeric', autocapitalize: 'characters', search });
```

`spellcheck` is **`false` by default**, unlike the other three. An autocomplete's value is
normally chosen from the list rather than typed as prose, so the proper nouns it holds —
surnames, place names, product codes — would otherwise sit under a red squiggle despite
being valid. There's also a privacy reason: Chrome's Enhanced Spell Check and Edge's
Microsoft Editor send the contents of text inputs to a remote service to check them, and
neither exempts a field carrying a name, address or account reference. Pass
`spellcheck: true` for a free-text search box where correction is genuinely wanted.

Because it always writes, `spellcheck` overrides the attribute on a server-rendered
`<input>` being enhanced. The other three are omitted entirely when unset, so an enhanced
input keeps whatever it was authored with.

### Restoring a server-rendered value

To restore a previously submitted / prefilled value on load, render `data-value` (and
`data-label` for a distinct display label). It is placed into the combobox and the hidden
field and behaves like a user-picked selection:

```html
<div class="js-autocomplete" data-value="GB" data-label="United Kingdom"></div>
```

For multiple mode, render several values by making `data-value`/`data-label` **JSON arrays**,
so the selections are server-rendered declaratively (no init options needed):

```html
<div class="js-autocomplete autocomplete--multiple"
    data-value='["GB","FR"]' data-label='["United Kingdom","France"]'></div>
```

Equivalently, pass arrays via init (`value: ['GB','FR']`, `label: ['United Kingdom','France']`),
or use a `<select multiple>` with pre-selected options. (A single `<input>` can't carry several
values without JS, so a `<select multiple>` is the only one of these that also degrades.)

Resetting the enclosing `<form>` restores this initial selection — the seeded value(s), a
pre-selected `<select>`'s option(s), or empty if there was none — so the enhanced control
behaves like the native `<select>` it replaces rather than leaving stale chips/values.

## Options
Options can be set during initialisation in an Object passed as the second argument, or as `data-*` attributes on the node. Precedence is `defaults → options → data-*`.
```
{
    name: null, //form field name; from options, data-name, or a wrapped <select>. Single mode adds one hidden field, multiple mode one per selection
    search: null, //(query, signal) => options, or a Promise when async; derived from `values` when omitted
    values: [], //option source for the built-in search when no `search` is given; strings or { value, label } objects
    minlength: 2, //characters required before a search runs
    maxResults: 6, //max results shown at once; extras are trimmed. 0 or Infinity shows all
    multiple: false, //accumulate selections as removable chips, each with its own hidden field
    async: false, //treat `search` as returning a Promise; requests are debounced
    debounceDelay: 200, //ms an async search waits for a pause in typing before firing
    value: null, //initial selection value(s) restored on load (e.g. from data-value); array for multiple mode
    label: null, //display label(s) for the initial value(s); falls back to the value
    displayTemplate: option => option.value, //maps an option to the text shown in the input and chips
    optionTemplate: false, //renders each list option (falls back to displayTemplate); markup from the exported `html` tag is set as HTML and a DOM node appended as-is, any other string is rendered as text
    submissionTemplate: option => option.value, //maps an option to its submitted value; also identifies a selection
    allowFreeText: false, //single mode: submit whatever is typed when no option is selected
    submitOnConfirm: false, //confirming an option (click/Enter) — or Enter on the raw query — submits the enclosing form; for search boxes
    confirmOnBlur: true, //commit the highlighted option when focus leaves the component
    clearOnBlur: false, //clear the input (and, single mode, the selection) when focus leaves uncommitted
    placeholder: '', //placeholder text for the generated input
    spellcheck: false, //spellchecking on the input; off by default (see Input attributes)
    inputmode: null, //virtual keyboard hint, e.g. 'search', 'numeric', 'email'; omitted when null
    autocorrect: null, //'on'/'off'; iOS autocorrection. Omitted when null
    autocapitalize: null, //'none'/'sentences'/'words'/'characters'; omitted when null
    inputClassName: 'autocomplete__input', //class applied to the generated input
    id: null, //id for the input/listbox wiring; taken from the node or <select>, else generated
    noResultsMsg: 'No results found', //shown and announced when a search matches nothing
    loadingMsg: 'Loading…', //announced while an async search is in flight
    hintMsg(minlength){ //visually-hidden minlength hint, linked via aria-describedby; string or fn, added only when minlength > 1
        return `Type ${minlength} or more characters for results`;
    },
    resultsMsg(count){ //announced when a search returns matches; string or fn of the match count (handles its own pluralisation)
        return `${count} ${count === 1 ? 'result is' : 'results are'} available`;
    },
    removeMsg(label){ //aria-label for a selected chip's remove button (multiple mode); string or fn of the option's display label
        return `Remove ${label}`;
    },
    selectionMsg(labels){ //visually-hidden summary of the current selection (multiple mode), linked via aria-describedby so it's announced when the input is refocused; string or fn of the display labels
        return labels.length ? `${labels.join(', ')} selected` : '';
    },
    selectionAddedMsg(label){ //announced in the live region when a selection is added (multiple mode); string or fn of the display label
        return `${label} added`;
    },
    selectionRemovedMsg(label){ //announced in the live region when a selection is removed (multiple mode); string or fn of the display label
        return `${label} removed`;
    }
}
```

## Accessibility

The component follows the [WAI-ARIA APG combobox with listbox popup](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) pattern. Keyboard focus stays in the `role="combobox"` input at all times; the highlighted option is tracked with `aria-activedescendant` on the input (and `aria-selected` on the option itself) rather than by moving DOM focus into the listbox. Options carry `aria-posinset`/`aria-setsize`, and result counts / status changes are announced via the visually-hidden `role="status"` live region.

Keyboard interaction:

| Key | Behaviour |
| --- | --- |
| `↓` / `↑` | Move the highlight through the options; `↑` from the first option returns to the input. |
| `Enter` | Commit the highlighted option (with nothing highlighted, a normal form submit is left to proceed — or, with `submitOnConfirm`, the raw query is submitted). |
| `Escape` | Close the list and clear the highlight; focus stays in the input. |
| `Space` | Ordinary space in the query; it never commits — the caret is in a textbox. |
| `Tab` | Move focus out of the component, committing the highlighted option first when `confirmOnBlur` is set. |
| `Backspace` | Ordinary edit; in multiple mode, on an empty input it removes the last chip. |

## Styling

The component ships no CSS — it augments the DOM and leaves presentation to you. Initialising
against your node builds this structure, whose classes are the styling hooks:

```html
<!-- the node you initialise against -->
<div class="js-autocomplete">
    <input class="autocomplete__input" role="combobox">
    <ul class="autocomplete__list" role="listbox" hidden>
        <li class="autocomplete__option" role="option">…</li>
        <li class="autocomplete__option autocomplete__option--active" role="option" aria-selected="true">…</li>
        <li class="autocomplete__option autocomplete__option--empty">No results found</li>
    </ul>
    <div class="autocomplete__status" role="status"></div>
    <span class="autocomplete__hint"></span>              <!-- only when minlength > 1 -->
    <span class="autocomplete__selection"></span>         <!-- multiple mode: selection summary for aria-describedby -->
    <input type="hidden" name="…">                        <!-- single mode, when name is set -->
    <!-- multiple mode: the chip list, added once there is a selection -->
    <ul class="autocomplete__output">
        <li class="autocomplete__chip">
            <span class="autocomplete__chip-label">…</span>
            <button class="autocomplete__chip-remove"></button>
            <input type="hidden" name="…">
        </li>
    </ul>
</div>
```

| Class | Element |
| --- | --- |
| `autocomplete__input` | The combobox input (override via the `inputClassName` option). |
| `autocomplete__list` | The `role="listbox"` popup; carries `hidden` while closed. |
| `autocomplete__option` | Each option in the list. |
| `autocomplete__option--active` | The highlighted option during keyboard navigation — the styling hook for the highlight (mirrors `aria-selected="true"`). Focus stays in the input, so `:focus` never lands on an option; target this class instead. |
| `autocomplete__option--empty` | The non-selectable no-results item. |
| `autocomplete__status` | Visually-hidden `role="status"` live region for announcements. |
| `autocomplete__hint` | Visually-hidden minlength hint linked via `aria-describedby`. |
| `autocomplete__selection` | Visually-hidden selection summary (multiple mode) linked via `aria-describedby`, announced when the input is refocused. |
| `autocomplete__output` | The chip container (multiple mode). |
| `autocomplete__chip` | A single selection chip. |
| `autocomplete__chip-label` | The chip's display label. |
| `autocomplete__chip-remove` | The chip's remove button. |

The `autocomplete__status`, `autocomplete__hint` and `autocomplete__selection` elements must
stay visually hidden but readable by assistive tech — style them with a visually-hidden (not
`display: none`) utility.

## API

The package also exports `html` (a tagged template that escapes its interpolations) and
`escapeHtml` (the underlying escaper), for building an `optionTemplate` that returns an
HTML string — see [Custom option template](#custom-option-template).

`autocomplete()` returns an array of instances, one per matched node. Each instance exposes:

```
{
    node,       // the augmented element
    getState,   // Function returning the current state Object
    clear       // Function clearing the current selection(s)
}
```

## Events

Instances dispatch bubbling `CustomEvent`s from the node so consumers can react without
holding the instance reference. Each carries `detail: { action, option, selected, getState }`.

| Event | Fired when |
| --- | --- |
| `autocomplete:confirm` | An option is selected. |
| `autocomplete:remove` | A selection is removed (multiple mode). |
| `autocomplete:clear` | `clear()` is called. |
| `autocomplete:open` | The suggestion list opens. |
| `autocomplete:close` | The suggestion list closes. |

`open` and `close` fire only on a real change of visibility — never twice for a list that
is already showing, and never for a close that closed nothing (`clear()` on an untouched
field, say). `detail.option` is `null` for both, since no option is involved; read
`detail.getState()` for the current `options`.

Confirming an option closes the list as part of the commit, so `autocomplete:close` fires
before `autocomplete:confirm`. Both run after the DOM has settled.

## Tests

```
npm t
```

## Browser support
Rendering uses [`Element.replaceChildren()`](https://caniuse.com/mdn-api_element_replacechildren), which sets the floor (Chrome 86, Firefox 78, Safari 14 — late 2020). Async mode additionally uses the [AbortController API](https://caniuse.com/abortcontroller), supported well before that.

`submitOnConfirm` submits via [`HTMLFormElement.requestSubmit()`](https://caniuse.com/mdn-api_htmlformelement_requestsubmit) so the `submit` event and native validation run — that raises the floor to **Safari 16** (Sept 2022) for this option only. On older Safari it falls back to `form.submit()`, which still submits the form but skips the `submit` event and validation.

## Dependencies
None — vanilla JS with no runtime dependencies.

## License
MIT

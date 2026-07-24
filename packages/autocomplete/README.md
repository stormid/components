# Autocomplete

An accessible, framework-agnostic autocomplete/combobox. Enhances an element into a
WAI-ARIA combobox with a listbox popup, supporting single or multiple selection, a
synchronous or asynchronous (remote) option source, and progressive enhancement of a
native `<select>`.

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
`values`/`list` array so there are options to choose from. Everything else has a sensible
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

### Custom option template

`displayTemplate` maps an option to the single line of text shown in the input, chips and
list. To show richer content in the **list only** — for example a second detail line —
supply an `optionTemplate`. It renders each list option (falling back to `displayTemplate`
when omitted) and may return either an HTML string or a DOM node, so the list can carry
markup the display label and submitted value don't.

The string is set as the option's `innerHTML`, so interpolated values must be escaped —
otherwise option data from an API could inject markup. The escaping happens at the
interpolation points, not on the whole string (the string's own tags are intentional
markup), so use the exported **`html`** tagged template: it leaves your tags untouched and
escapes every `${…}` value automatically — no manual escaping in the template:

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

If you build the HTML string some other way, the lower-level `escapeHtml` is also exported
so you can escape values by hand (``` `<span>${escapeHtml(option.label)}</span>` ```).

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

Only a string returned by `optionTemplate` is treated as HTML; the `displayTemplate`
fallback is always rendered as plain text.

### Submitting on confirm (search box)

By default, choosing a suggestion commits it and keeps the user on the page. For a
search-style autocomplete — where choosing a suggestion should *go* somewhere — set
`submitOnConfirm: true`. Confirming an option (by click, Space or Enter) then commits it and
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

### Restoring a server-rendered value

To restore a previously submitted / prefilled value on load, render `data-value` (and
`data-label` for a distinct display label). It is placed into the combobox and the hidden
field and behaves like a user-picked selection:

```html
<div class="js-autocomplete" data-value="GB" data-label="United Kingdom"></div>
```

For multiple mode, pass arrays via init (`value: ['GB','FR']`, `label: ['United Kingdom','France']`)
or use a `<select multiple>` with pre-selected options.

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
    list: false, //full option set shown when opened with no query (e.g. via Space)
    minlength: 2, //characters required before a search runs
    maxResults: 6, //max results shown at once; extras are trimmed. 0 or Infinity shows all. Does not cap `list`
    multiple: false, //accumulate selections as removable chips, each with its own hidden field
    async: false, //treat `search` as returning a Promise; requests are debounced
    value: null, //initial selection value(s) restored on load (e.g. from data-value); array for multiple mode
    label: null, //display label(s) for the initial value(s); falls back to the value
    displayTemplate: option => option.value, //maps an option to the text shown in the input and chips
    optionTemplate: false, //renders each list option (falls back to displayTemplate); a returned string is set as HTML (build it with the exported `html` tag so values are escaped), a DOM node is appended as-is
    submissionTemplate: option => option.value, //maps an option to its submitted value; also identifies a selection
    allowFreeText: false, //single mode: submit whatever is typed when no option is selected
    submitOnConfirm: false, //confirming an option (click/Space/Enter) — or Enter on the raw query — submits the enclosing form; for search boxes
    confirmOnBlur: true, //commit the focused option when focus leaves the component
    clearOnBlur: false, //clear the input (and, single mode, the selection) when focus leaves uncommitted
    placeholder: '', //placeholder text for the generated input
    inputClassName: 'autocomplete__input', //class applied to the generated input
    id: null, //id for the input/listbox wiring; taken from the node or <select>, else generated
    noResultsMsg: 'No results found', //shown and announced when a search matches nothing
    loadingMsg: 'Loading…', //announced while an async search is in flight
    hintMsg(minlength){ //visually-hidden minlength hint, linked via aria-describedby; string or fn, added only when minlength > 1
        return `Type ${minlength} or more characters for results`;
    }
}
```

## Styling

The component ships no CSS — it augments the DOM and leaves presentation to you. Initialising
against your node builds this structure, whose classes are the styling hooks:

```html
<!-- the node you initialise against -->
<div class="js-autocomplete">
    <input class="autocomplete__input" role="combobox">
    <ul class="autocomplete__list" role="listbox" hidden>
        <li class="autocomplete__option" role="option">…</li>
        <li class="autocomplete__option autocomplete__option--empty">No results found</li>
    </ul>
    <div class="autocomplete__status" role="status"></div>
    <span class="autocomplete__hint"></span>              <!-- only when minlength > 1 -->
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
| `autocomplete__option--empty` | The non-selectable no-results item. |
| `autocomplete__status` | Visually-hidden `role="status"` live region for announcements. |
| `autocomplete__hint` | Visually-hidden minlength hint linked via `aria-describedby`. |
| `autocomplete__output` | The chip container (multiple mode). |
| `autocomplete__chip` | A single selection chip. |
| `autocomplete__chip-label` | The chip's display label. |
| `autocomplete__chip-remove` | The chip's remove button. |

The `autocomplete__status` and `autocomplete__hint` elements must stay visually hidden but
readable by assistive tech — style them with a visually-hidden (not `display: none`) utility.

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

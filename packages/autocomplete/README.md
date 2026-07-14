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

The visible input is display/search only; the submitted value is carried by a hidden
field (single mode) or one hidden field per chip (multiple mode), so `template` can show a
label while the form receives the `extractValue`.

Any option can also be set with a `data-*` attribute on the node. Precedence is
`defaults → options → data-*`, so a `data-*` attribute wins over an option passed to init.

### Asynchronous (remote) source

The most common setup is searching a remote API. Set `async: true` and return a Promise
from `search`. Requests are debounced (so the API is hit once the user pauses, not on every
keystroke), a loading message is announced while a request is in flight, and stale
responses from superseded queries are discarded.

`search` receives the query and an `AbortSignal` as its second argument — pass it to
`fetch` so an in-flight request is cancelled when a newer keystroke supersedes it. Map the
API's response shape to the options your `template`/`extractValue` expect:

```js
autocomplete('.js-autocomplete', {
    name: 'country',
    async: true,
    //show the country name, submit the country code
    template: option => option.label,
    extractValue: option => option.value,
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

### Restoring a server-rendered value

To restore a previously submitted / prefilled value on load, render `data-value` (and
`data-label` for a distinct display label). It is placed into the combobox and the hidden
field and behaves like a user-picked selection:

```html
<div class="js-autocomplete" data-value="GB" data-label="United Kingdom"></div>
```

For multiple mode, pass arrays via init (`value: ['GB','FR']`, `label: ['United Kingdom','France']`)
or use a `<select multiple>` with pre-selected options.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `search` | `function` | derived from `values` | `(query, signal) => options`, or `Promise<options>` when `async`. The `signal` (async only) aborts a superseded request. |
| `minlength` | `number` | `2` | Characters required before a search runs. Below it the list stays closed and `queryTooShortMsg` is announced. |
| `multiple` | `boolean` | `false` | Allow multiple selections, rendered as removable chips, each with its own hidden field. |
| `async` | `boolean` | `false` | Treat `search` as returning a Promise; requests are debounced and `loadingMsg` is announced while in flight. |
| `name` | `string` | — | Form field name. Single mode adds one hidden field; multiple mode repeats it per selection. |
| `list` | `array` | `false` | The full option set shown when the input is opened with no query (e.g. via Space). |
| `values` | `string[]` | `[]` | Source strings for the built-in search when no `search` is supplied. |
| `template` | `function` | `option => option.value` | Maps an option to the text shown in the input, list and chips. |
| `extractValue` | `function` | `option => option.value` | Maps an option to the value submitted via the hidden field. |
| `value` | `string` \| `string[]` | — | Initial selection value(s) restored on load (e.g. from `data-value`) and submitted via the hidden field. Array for multiple mode. |
| `label` | `string` \| `string[]` | — | Display label(s) for the initial `value`(s) (e.g. from `data-label`); falls back to the value when omitted. |
| `placeholder` | `string` | `''` | Placeholder text for the generated input. |
| `allowFreeText` | `boolean` | `false` | Single mode: submit whatever is typed when no option is selected, rather than acting as a strict picker. |
| `confirmOnBlur` | `boolean` | `true` | Commit the focused option when focus leaves the component. |
| `clearOnBlur` | `boolean` | `false` | Clear the input (and, in single mode, the selection) when focus leaves without a committed selection. |
| `noResultsMsg` | `string` | `'No results found'` | Shown in the open list, and announced, when a search matches nothing. |
| `loadingMsg` | `string` | `'Loading…'` | Announced while an async search is in flight. |
| `queryTooShortMsg` | `string` \| `function` | `` `Type ${minlength} or more characters for results` `` | Announced below `minlength`. A function receives `minlength`. |
| `inputClassname` | `string` | `'autocomplete__input'` | Class applied to the generated input. |
| `id` | `string` | derived | Id for the input/listbox wiring; otherwise taken from the node or `<select>`, or generated. |

## API

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

## License
MIT

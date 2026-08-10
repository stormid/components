import autocomplete, { html } from '../../../src';
import { fruits, countries } from './data.js';

window.addEventListener('DOMContentLoaded', () => {
    // Default: a single-select combobox that enhances a real, server-rendered
    // <input> in place — so the field submits typed text even with JS off. Its id,
    // name and placeholder are read from the markup; `search` (required) returns the
    // matches for the current query.
    autocomplete('.js-autocomplete', {
        search(query){
            return fruits.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });

    // Multiple selection: each committed option becomes a removable chip and the
    // input clears, ready for the next search. It enhances a server-rendered
    // <input>, so with JS off it degrades to a single search field (one input can't
    // carry several values) submitting under the adopted name.
    autocomplete('.js-autocomplete-multiple', {
        multiple: true,
        search(query){
            return fruits.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });

    // Async source: `search` may return a Promise, so results can come from any
    // asynchronous source — async isn't only fetch. Here a setTimeout over the
    // local list stands in for network latency; the component shows the loading
    // state while it resolves and discards responses whose query is now stale. The
    // field is a server-rendered <input> that submits without JS; only the
    // suggestions need it.
    autocomplete('.js-autocomplete-async', {
        async: true,
        search(query){
            return new Promise(resolve => {
                setTimeout(() => resolve(fruits.filter(item => item.value.toLowerCase().includes(query.toLowerCase()))), 300);
            });
        }
    });

    // Remote fetch: `search` hits a real (mocked) HTTP endpoint at /api/countries
    // — see tools/rspack.config.js. The component debounces input, only fires past
    // minlength, and aborts a superseded request via the AbortSignal it passes to
    // `search`. The API's { code, name } rows are mapped to { value, label }.
    // Showcases: async + multiple, displayTemplate (value/label split),
    // optionTemplate (rich two-line rows), request cancellation via signal.
    autocomplete('.js-autocomplete-endpoint', {
        async: true,
        multiple: true,
        //display the country name in the input/chips, submit the country code
        displayTemplate: option => option.label,
        //custom option template as a template literal: each list row shows the
        //country name plus its code on a second line. The `html` tag escapes each
        //interpolated (untrusted) API value automatically and brands the result as
        //markup — without it the tags would render as visible text, not innerHTML.
        optionTemplate: option => html`
            <span class="autocomplete__option-title">${option.label}</span>
            <small class="autocomplete__option-detail">${option.value}</small>
        `,
        //signal aborts this request if a newer keystroke supersedes it
        search(query, signal){
            return fetch(`/api/countries?q=${encodeURIComponent(query)}`, { signal })
                .then(res => {
                    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                    return res.json();
                })
                //map the API's { code, name } shape to the { value, label } options expect
                .then(rows => rows.map(row => ({ value: row.code, label: row.name })));
        }
    });

    // Search box: enhances a server-rendered <input type="search"> and, with
    // submitOnConfirm, submits the enclosing form when a suggestion is confirmed (or
    // the raw query on Enter). allowFreeText carries the typed value when nothing is
    // picked — so with JS off it degrades to exactly the plain search field it was.
    autocomplete('.js-autocomplete-input', {
        submitOnConfirm: true,
        allowFreeText: true,
        search(query){
            return fruits.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });

    // Progressive enhancement: wrap a native <select> and the component sources
    // its options, name and (for <select multiple>) the multiple flag from the
    // markup. Placeholders here come from data-placeholder on the wrapper, demonstrating dataset config.
    autocomplete('.js-autocomplete-select');
    autocomplete('.js-autocomplete-select-multiple');

    // Prefilled (single): the row ships an empty server-rendered <input> (so it
    // degrades to a plain search field with JS off), plus data-value/data-label on the
    // wrapper. With JS, that pair is restored into the combobox — the label shows, the
    // value submits via the hidden field — so a restored value behaves like a picked
    // one. The empty input never overrides the data-value, so the split still holds.
    autocomplete('.js-autocomplete-prefilled', {
        displayTemplate: option => option.label,
        search(query){
            return countries.filter(country => country.label.toLowerCase().includes(query.toLowerCase()));
        }
    });

    // Prefilled (multiple): the selections are server-rendered declaratively as
    // JSON arrays in data-value/data-label on the node (not passed to init), and the
    // component restores them as chips. It enhances an empty <input>, so without JS
    // it's an empty search field — multi-value restore is inherently a JS feature.
    autocomplete('.js-autocomplete-prefilled-multiple', {
        multiple: true,
        displayTemplate: option => option.label,
        search(query){
            return countries.filter(country => country.label.toLowerCase().includes(query.toLowerCase()));
        }
    });
});

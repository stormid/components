import autocomplete, { html } from '../../../src';
import { fruits, countries } from './data.js';

window.addEventListener('DOMContentLoaded', () => {
    // Default: the minimal setup — a single-select combobox backed by a local
    // list. `search` (required) returns the matches for the current query.
    autocomplete('.js-autocomplete', {
        name: 'default',
        placeholder: 'e.g. Apple',
        search(query){
            return fruits.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });

    // Multiple selection: each committed option becomes a removable chip and the
    // input clears, ready for the next search.
    autocomplete('.js-autocomplete-multiple', {
        name: 'fruits',
        placeholder: 'e.g. Apple',
        multiple: true,
        search(query){
            return fruits.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });

    // Async source: `search` may return a Promise, so results can come from any
    // asynchronous source — async isn't only fetch. Here a setTimeout over the
    // local list stands in for network latency; the component shows the loading
    // state while it resolves and discards responses whose query is now stale.
    autocomplete('.js-autocomplete-async', {
        name: 'fruits-async',
        placeholder: 'e.g. Apple',
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
        name: 'country-code',
        placeholder: 'e.g. United Kingdom',
        async: true,
        multiple: true,
        //display the country name in the input/chips, submit the country code
        displayTemplate: option => option.label,
        //custom option template as a template literal: each list row shows the
        //country name plus its code on a second line. The `html` tag escapes each
        //interpolated (untrusted) API value automatically, so the string is safe to
        //set as the option's innerHTML.
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

    // Progressive enhancement: wrap a native <select> and the component sources
    // its options, name and (for <select multiple>) the multiple flag from the
    // markup. Placeholders here come from data-placeholder on the wrapper, demonstrating dataset config.
    autocomplete('.js-autocomplete-select');
    autocomplete('.js-autocomplete-select-multiple');

    // Prefilled (single): a server-rendered value/label pair restored on load from
    // data-value/data-label on the node — the label shows in the combobox, the
    // value submits via the hidden field, so a restored value behaves like a
    // user-picked one.
    autocomplete('.js-autocomplete-prefilled', {
        name: 'prefilled',
        placeholder: 'e.g. United Kingdom',
        displayTemplate: option => option.label,
        search(query){
            return countries.filter(country => country.label.toLowerCase().includes(query.toLowerCase()));
        }
    });

    // Prefilled (multiple): initial selections restored as chips from value/label
    // arrays passed as options (rather than from the DOM).
    autocomplete('.js-autocomplete-prefilled-multiple', {
        name: 'prefilled-multiple',
        placeholder: 'e.g. United Kingdom',
        multiple: true,
        value: ['GB', 'FR'],
        label: ['United Kingdom', 'France'],
        displayTemplate: option => option.label,
        search(query){
            return countries.filter(country => country.label.toLowerCase().includes(query.toLowerCase()));
        }
    });
});

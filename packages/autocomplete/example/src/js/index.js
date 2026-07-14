import autocomplete from '../../../src';

const values = [
    {
        value: 'Apple',
        label: 'Apple'
    },
    {
        value: 'Banana',
        label: 'Banana'
    },
    {
        value: 'Cherry',
        label: 'Cherry'
    },
    {
        value: 'Potato',
        label: 'Potato'
    },
    {
        value: 'Sweet potato',
        label: 'Sweet potato'
    },
];

window.addEventListener('DOMContentLoaded', () => {
    autocomplete('.js-autocomplete', {
        name: 'default',
        placeholder: 'e.g. Apple',
        // list: values,
        search(query){
            return values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });

    autocomplete('.js-autocomplete-multiple', {
        name: 'fruits',
        multiple: true,
        search(query){
            return values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });

    autocomplete('.js-autocomplete-async', {
        name: 'country',
        async: true,
        //stand-in for a remote endpoint: resolve the local list after a short
        //delay to simulate network latency (see the fetch example below for the
        //real-API pattern).
        search(query){
            return new Promise(resolve => {
                setTimeout(() => resolve(values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()))), 300);
            });
        }
    });

    //remote search against a real endpoint (mocked by the dev server at
    ///api/countries — see tools/rspack.config.js). The component debounces the
    //call, only fires past minlength, and discards stale responses.
    autocomplete('.js-autocomplete-endpoint', {
        name: 'country-code',
        async: true,
        //display the country name, submit the country code (see mapping below)
        template: option => option.label,
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

    //free text: submit a chosen suggestion's value, or whatever the user types
    autocomplete('.js-autocomplete-freetext', {
        name: 'herb',
        allowFreeText: true,
        search(query){
            return values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });

    //progressive enhancement: options, name and multiple are read from the <select>
    autocomplete('.js-autocomplete-select');
    autocomplete('.js-autocomplete-select-multiple');
});
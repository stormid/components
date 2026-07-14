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

    //custom option template: the list shows a second detail line per option, while
    //the input still shows just the name (template) and the form submits the code
    //(extractValue). optionTemplate builds a DOM node — no HTML string, so untrusted
    //API values are set as text and can't inject markup.
    const airports = [
        { value: 'LHR', label: 'Heathrow', detail: 'London, United Kingdom' },
        { value: 'JFK', label: 'John F. Kennedy', detail: 'New York, United States' },
        { value: 'CDG', label: 'Charles de Gaulle', detail: 'Paris, France' },
        { value: 'HND', label: 'Haneda', detail: 'Tokyo, Japan' },
        { value: 'SYD', label: 'Kingsford Smith', detail: 'Sydney, Australia' }
    ];
    autocomplete('.js-autocomplete-detail', {
        name: 'airport',
        template: option => option.label,
        extractValue: option => option.value,
        optionTemplate(option){
            const title = document.createElement('span');
            title.classList.add('autocomplete__option-title');
            title.textContent = option.label;
            const detail = document.createElement('small');
            detail.classList.add('autocomplete__option-detail');
            detail.textContent = option.detail;
            const wrap = document.createElement('span');
            wrap.append(title, detail);
            return wrap;
        },
        search(query){
            const q = query.toLowerCase();
            return airports.filter(airport => airport.label.toLowerCase().includes(q) || airport.detail.toLowerCase().includes(q));
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

    //prefilled: a server-rendered value/label pair restored on load — the label
    //(data-label) shows in the combobox, the value (data-value) submits via the
    //hidden field. Distinct value/label (a code vs a display name) shows the split.
    const countries = [
        { value: 'GB', label: 'United Kingdom' },
        { value: 'FR', label: 'France' },
        { value: 'DE', label: 'Germany' },
        { value: 'ES', label: 'Spain' }
    ];
    autocomplete('.js-autocomplete-prefilled', {
        name: 'prefilled',
        template: option => option.label,
        search(query){
            return countries.filter(country => country.label.toLowerCase().includes(query.toLowerCase()));
        }
    });

    //prefilled multiple: initial selections restored as chips from value/label arrays
    autocomplete('.js-autocomplete-prefilled-multiple', {
        name: 'prefilled-multiple',
        multiple: true,
        value: ['GB', 'FR'],
        label: ['United Kingdom', 'France'],
        template: option => option.label,
        search(query){
            return countries.filter(country => country.label.toLowerCase().includes(query.toLowerCase()));
        }
    });
});
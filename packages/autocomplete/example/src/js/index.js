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
        //delay to simulate network latency. Swap for fetch(...).then(r => r.json()).
        search(query){
            return new Promise(resolve => {
                setTimeout(() => resolve(values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()))), 300);
            });
        }
    });
});
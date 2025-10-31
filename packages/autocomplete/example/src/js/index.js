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
        search(query){
            return values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));
        }
    });
});
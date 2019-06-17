import Measure from '../../../src';
const types = [
    {
        regex: /^tel:.*/,
        category: 'Telephone Link'
    },
    {
        regex: /^mailto:.*/,
        category: 'Email Link'
    },
    {
        regex: /^https?:.*/,
        category: 'External Link'
    },
    {
        regex: /^.+\.(pdf)$/,
        category: 'PDF Download'
    }
];


window.addEventListener('DOMContentLoaded', () => {
    window.__Measure__ = Measure.init( 'UA-141774857-1');    
    // __Measure__.event({ category: 'Test category', action: 'Test action', label: 'Test label', value: 666 })    
});
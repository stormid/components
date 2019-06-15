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

const composeLinkEvent = link => {
    const href = link.href;
    for(let type of types){
        if(href.match(type.regex)) return {
            category: type.category,
            action: href,
            label: link.innerText
        }
    }
};

const handler = eventData => e => {
    if(3 === e.which) return;
    __Measure__.event(eventData);
};

window.addEventListener('DOMContentLoaded', () => {
    window.__Measure__ = Measure.init(
        'UA-141774857-1',
        {
            parameters: { uid: 'unanonymised test' },
            settings: { debug: true }
        }
    );    
    // __Measure__.event({ category: 'Test category', action: 'Test action', label: 'Test label', value: 666 })
    const links = document.querySelectorAll('a');
    for(let link of links){
        link.addEventListener('click', handler(composeLinkEvent(link)));
    }
});
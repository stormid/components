import validate from '../../../src';
import { isValidDate, isFuture, isPast } from '../../../src/lib/plugins/methods/date';

{
    const [ validator ] = validate('form');

    validator.addMethod(
        'date', //name of custom validation group
        isValidDate, // date validation method imported from the library 
        'Enter a valid date', // error message
        [ document.getElementById('dateDay'), document.getElementById('dateMonth'), document.getElementById('dateYear') ] //date fields array [day, month, year]
    );

    validator.addMethod(
        'date', //name of custom validation group
        isFuture, // date validation method imported from the library 
        'Enter a valid date in the future', // error message
        [ document.getElementById('dateDay'), document.getElementById('dateMonth'), document.getElementById('dateYear') ] //date fields array [day, month, year]
    );

    // const later = document.getElementById('Later');
    // document.querySelector('.js-add').addEventListener('click', e => {
    //     if (later.hasAttribute('required')) {
    //         later.removeAttribute('required');
    //         validator[0].removeGroup(later.getAttribute('name'));
    //     } else {
    //         later.setAttribute('required', 'required');
    //         validator[0].addGroup([later]);
    //     }
    // });
    // const inputs = [ document.querySelector('#f1'), document.querySelector('#f2') ];
    // validator.addMethod(
    //     'CustomGroup',
    //     (value, fields) => {
    //         console.log(value);
    //         console.log(inputs);
    //         return inputs[0].value.trim() === 'potato' || inputs[1].value.trim() === 'potato';
    //     },
    //     'One of the inputs must be the word "potato"',
    //     inputs
    // );

    console.log(validator.getState());

};
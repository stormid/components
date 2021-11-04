import validate from '../../../src';
{
    const [ validator ] = validate('form');

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
    const inputs = [ document.querySelector('#f1'), document.querySelector('#f2') ];
    validator.addMethod(
        'CustomGroup',
        (value, fields) => {
            console.log(value);
            console.log(inputs);
            return inputs[0].value.trim() === 'potato' || inputs[1].value.trim() === 'potato';
        },
        'One of the inputs must be the word "potato"',
        inputs
    );

    console.log(validator.getState());

};
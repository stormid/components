import validate from '../../../src';
{
    const [ validator ] = validate('form');
    console.log(validator.getState());

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
};
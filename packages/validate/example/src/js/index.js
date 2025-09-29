import validate from '../../../src';
import { isValidDate, isFutureDate, isPastDate } from '../../../src/lib/plugins/methods/date';

{
    const formToValidate = document.querySelector('.js-validate');
    const resetBtn = document.getElementById('resetBtn');

    if(resetBtn) resetBtn.addEventListener('click', () => {     
        const event = new Event('reset');
        formToValidate.dispatchEvent(event);
    });
    
    const [ validator ] = validate(formToValidate, {
        preSubmitHook: () => {
            const hiddenCheck = document.createElement('input');
            hiddenCheck.setAttribute('type', 'hidden');
            hiddenCheck.setAttribute('name', 'hiddenCheck');
            hiddenCheck.setAttribute('value', 'true');
            formToValidate.appendChild(hiddenCheck);
        }
    });

    if(document.getElementById('dateDay') && document.getElementById('dateMonth') && document.getElementById('dateYear')) {
        validator.addMethod(
            'date', 
            isValidDate, 
            'Enter a valid date', 
            [ document.getElementById('dateDay'), document.getElementById('dateMonth'), document.getElementById('dateYear') ] 
        );

        validator.addMethod(
            'date', 
            isFutureDate, 
            'Enter a valid date in the future', 
            [ document.getElementById('dateDay'), document.getElementById('dateMonth'), document.getElementById('dateYear') ] 
        );
    }

    window.validator = validator;
};
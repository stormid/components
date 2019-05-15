import Validate from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    // window.__t1__ = Tabs.init('.js-tabs');
<<<<<<< Updated upstream
    Validate.init('form', { 
        preSubmitHook(){
            window.dataLayer = [{
                'formName': 'Request Information',
                'clinicianID': '{logged in user ID}',
                'organisationID': '{logged in user’s organisation ID}',
                'appointmentID': '{appointment ID}',
                'event': 'formSubmit'
            }];
            debugger;
        }
    })
=======
    Validate.init('form')
>>>>>>> Stashed changes
    // console.log(__validators__[document.querySelector('.js-validate')].getState());
});
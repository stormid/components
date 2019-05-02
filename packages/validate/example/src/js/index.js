import Validate from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    // window.__t1__ = Tabs.init('.js-tabs');
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
    // console.log(__validators__[document.querySelector('.js-validate')].getState());
});
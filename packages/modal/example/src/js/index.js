import modal from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    modal('.js-modal');
    modal('.js-modal-start-open', {startOpen: true});
});
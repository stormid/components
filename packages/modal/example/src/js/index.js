import modal from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    window.__m1__ = modal('.js-modal', {
        callback(){
            console.log('callback called');
        }
    });
});
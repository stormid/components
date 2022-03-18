import modal from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    window.__m1__ = modal('.js-modal', {
        // startOpen: true,
        callback(){
            console.log('callback called');
        }
    });
    
});
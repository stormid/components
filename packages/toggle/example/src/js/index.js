import toggle from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    toggle('.js-toggle-menu', {
        focus: false,
        closeOnClick: true,
        closeOnBlur: true,
        useHidden: true
    });

    toggle('.js-toggle-trap', {
        focus: true,
        trapTab: true
    });

    toggle('.js-toggle-local', {
        local: true
    });

    toggle('.js-toggle-data', {
        local: true
    });
});
    
    
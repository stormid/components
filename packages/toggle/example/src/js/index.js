import toggle from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    window.__t1__ = toggle('.js-toggle', {
        focus: false,
        closeOnClick: true,
        closeOnBlur: true,
        useHidden: true
    });
});
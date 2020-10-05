import toggle from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    window.__t1__ = toggle('.js-toggle', {
        focus: true,
        closeOnBlur: true,
        trapTab: true
    });
    window.__t2__ = toggle('.js-toggle__local', {
        closeOnBlur: true
    });
});
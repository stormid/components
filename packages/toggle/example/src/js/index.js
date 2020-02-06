import toggle from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    window.__t1__ = toggle('.js-toggle');
    window.__t2__ = toggle('.js-toggle__local', { closeOnBlur: true });
});
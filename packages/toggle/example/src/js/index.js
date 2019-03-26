import Toggle from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {    
    window.__t1__ = Toggle.init('.js-toggle', { closeOnBlur: true, trapTab: false });
    window.__t2__ = Toggle.init('.js-toggle__local', { closeOnBlur: true });
});
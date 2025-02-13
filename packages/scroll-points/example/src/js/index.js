import scrollPoints from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    scrollPoints('.js-scroll-point', { rootMargin: '0px 0px -50% 0px', unload: false, replay: true });
});
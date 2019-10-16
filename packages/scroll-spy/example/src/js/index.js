import ScrollSpy from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    const instance = ScrollSpy.init('.js-scroll-spy');

    console.log(instance);
});
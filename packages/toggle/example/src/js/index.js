import toggle from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    window.__t1__ = toggle('.js-toggle', {
        focus: false,
        closeOnClick: true,
        closeOnBlur: true,
        useHidden:true
    });
    // window.__t2__ = toggle('.js-toggle__local', {
    //     closeOnBlur: true
    // });

    // document.addEventListener('Toggle.Open', e => {
    //     console.log(e.detail.getState());
    // });
});
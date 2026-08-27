import toggle from '../../../src/index.js';

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

    //exposed so the Playwright suite can drive the instance API, e.g. destroy
    window.instances = toggle('.js-toggle-local', {
        local: true
    });
});

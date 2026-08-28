import tabs from '../../../src';

window.addEventListener('DOMContentLoaded', () => {
    tabs('.js-tabs-manual [role=tablist]', {
        activation: 'manual'
    });

    tabs('.js-tabs-auto [role=tablist]', {
        activation: 'auto'
    });

    const buttonStatus = document.getElementById('button-tabs-status');
    tabs('.js-tabs-buttons [role=tablist]', {
        activation: 'manual',
        onChange: ({ activeIndex }) => { buttonStatus.textContent = `Showing panel ${activeIndex + 1}`; }
    });

    tabs('.js-tabs-focus [role=tablist]', {
        focusOnLoad: true
    });

    tabs('.js-tabs-activate [role=tablist]', {
        activeIndex: 2
    });
});

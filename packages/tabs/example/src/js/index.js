import tabs from '../../../src';

window.addEventListener('DOMContentLoaded', () => {
    tabs('.js-tabs-manual [role=tablist]', {
        activation: 'manual'
    });

    tabs('.js-tabs-auto [role=tablist]', {
        activation: 'auto'
    });

    tabs('.js-tabs-buttons [role=tablist]', {
        activation: 'manual',
        onChange: ({ activeIndex }) => console.log(`Button tabs changed to index ${activeIndex}`)
    });

    tabs('.js-tabs-focus [role=tablist]', {
        focusOnLoad: true
    });

    tabs('.js-tabs-activate [role=tablist]', {
        activeIndex: 2
    });
});

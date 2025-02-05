import toggle from '../../../src';

const docToggle = document.querySelector('.js-toggle');
docToggle && toggle(docToggle);

const localToggles = Array.from(document.querySelectorAll('.js-toggle__local'));
localToggles.length && toggle(localToggles, { local: true });
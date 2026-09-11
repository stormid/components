import textarea from '../../../src';

window.addEventListener('DOMContentLoaded', () => {
    // ?fallback forces the JS path even where native field-sizing is supported,
    // so the fallback behaviour can be demoed/tested. Instances are exposed for the same reason.
    const forceFallback = new URLSearchParams(window.location.search).has('fallback');
    window.instances = textarea('.js-textarea', { forceFallback });
});

/*
 * Skip
 *
 * Ensures fragment identifier links (e.g. "skip to content") move keyboard
 * focus to their target node, not just the scroll position.
 *
 * Modern browsers already do this when the target is focusable, so the
 * simplest fix is a static `tabindex="-1"` on the target in your markup and no
 * JavaScript at all. This module is a progressive enhancement for targets you
 * cannot annotate, and covers the cases native fragment navigation and a lone
 * `hashchange` listener miss: a page loaded with a hash already in the URL, and
 * re-activating a link whose hash already matches the current URL.
 */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {

    // Elements that can already receive focus without help. Anything that
    // already carries a tabindex is left untouched so we never override
    // authored markup (e.g. a target the developer correctly gave tabindex="-1").
    const NATIVELY_FOCUSABLE = [
        'a[href]', 'area[href]',
        'button:not([disabled])', 'input:not([disabled])',
        'select:not([disabled])', 'textarea:not([disabled])',
        'iframe', 'summary', 'audio[controls]', 'video[controls]',
        '[contenteditable]'
    ].join(',');

    const focusFragment = raw => {
        if (!raw) return;
        let id = raw;
        try { id = decodeURIComponent(raw); } catch { /* malformed escape sequence, fall back to the raw value */ }
        const element = document.getElementById(id);
        if (!element) return;
        // Only make the target focusable when it is not already, and use
        // tabindex="-1" so it can receive programmatic focus without being
        // inserted into the sequential tab order.
        if (!element.hasAttribute('tabindex') && !element.matches(NATIVELY_FOCUSABLE)) element.setAttribute('tabindex', '-1');
        element.focus();
    };

    const focusCurrentFragment = () => focusFragment(window.location.hash.substring(1));

    // Hash changed: link to a new fragment, back/forward, or a programmatic change.
    window.addEventListener('hashchange', focusCurrentFragment);

    // Re-activating a same-page link whose hash already matches the URL does not
    // fire hashchange, so handle those clicks explicitly. Cross-page and
    // hash-changing links are left to the browser and the hashchange listener.
    document.addEventListener('click', ({ target }) => {
        if (!target || !target.closest) return;
        const link = target.closest('a[href]');
        if (!link || !link.hash) return;
        if (link.origin !== window.location.origin || link.pathname !== window.location.pathname) return;
        if (link.hash !== window.location.hash) return;
        focusFragment(link.hash.substring(1));
    });

    // Page loaded with a fragment already in the URL (bookmark, share, reload).
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', focusCurrentFragment);
    else focusCurrentFragment();
}

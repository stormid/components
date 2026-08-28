import { FOCUSABLE_ELEMENTS } from './constants.js';

//Modernizr cookie test
export const cookiesEnabled = () => {
    try {
        document.cookie = 'cookietest=1';
        const ret = document.cookie.indexOf('cookietest=') !== -1;
        document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
        return ret;
    } catch {
        return false;
    }
};

export const writeCookie = state => {
    document.cookie = [
        `${state.settings.name}=${btoa(JSON.stringify({ consent: state.consent }))};`,
        `expires=${(new Date(new Date().getTime() + (state.settings.expiry*24*60*60*1000))).toUTCString()};`,
        state.settings.path ? `path=${state.settings.path};` : '',
        state.settings.domain ? `domain=${state.settings.domain};` : '',
        state.settings.samesite ? `SameSite=${state.settings.samesite};` : '',
        state.settings.secure ? `secure` : ''
    ].join('');
};

export const readCookie = settings => {
    const match = document.cookie.split('; ').find(cookie => cookie.split('=')[0] === settings.name);
    if (!match) return false;
    // slice from the first '=' rather than split('=')[1]: the base64 value can contain '=' padding.
    return window.atob(match.slice(match.indexOf('=') + 1));
};

const updateCookie = (state, cookie) => document.cookie = [
    `${cookie.name}=${cookie.value};`,
    `expires=${cookie.expiry};`,
    `path=${state.settings.path};`,
    state.settings.domain ? `domain=${state.settings.domain};` : '',
    state.settings.samesite ? `SameSite=${state.settings.samesite};` : '',
    state.settings.secure ? `secure` : ''
].join('');

export const deleteCookies = state => {
    //no cookies: ''.split('; ') yields [''], which would expire a nameless "=undefined" cookie
    if (!document.cookie) return;
    document.cookie
        .split('; ')
        .filter(part => part.split('=')[0]) //skip any malformed, nameless entry
        .map(part => ({
            name: part.split('=')[0],
            value: part.split('=')[1],
            expiry: 'Thu, 01 Jan 1970 00:00:01 GMT'
        }))
        .forEach(cookie => updateCookie(state, cookie));
};

export const extractFromCookie = settings => {
    try {
        const cookie = readCookie(settings);
        if (!cookie) return [false, {}];
        const { consent } = JSON.parse(cookie);
        const hasCookie = consent !== undefined;
        if (!categoriesMatch(Object.keys(consent), Object.keys(settings.types))) return [false, {}];
        return [hasCookie, consent || {}];
    } catch {
        return [false, {}];
    }
};

const categoriesMatch = (found, categories) => {
    if (found.length !== categories.length) return false;
    for (const category of categories) {
        if (found.indexOf(category) === -1) return false;
    }
    return true;
};

export const isCheckable = field => (/radio|checkbox/i).test(field.type);

const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

export const groupValueReducer = (acc, input) => {
    if (!isCheckable(input) && hasValue(input)) acc = input.value;
    if (isCheckable(input) && input.checked) {
        if (Array.isArray(acc)) acc.push(input.value);
        else acc = [input.value];
    }
    return acc;
};

// PSL private-section suffixes: shared hosting domains where each subdomain is a separate site.
// Browsers do NOT block cookies on these (the cookie public-suffix rule uses the PSL's ICANN
// section only), so the domain probe below would over-broaden to the shared suffix and leak the
// consent cookie across every tenant. Narrowing back to the app host prevents that. Intentionally
// short — add hosting suffixes as needed.
export const PRIVATE_SUFFIXES = [
    'azurewebsites.net', 'netlify.app', 'netlify.com', 'github.io', 'gitlab.io',
    'herokuapp.com', 'pages.dev', 'vercel.app', 'web.app', 'firebaseapp.com', 'appspot.com'
];

// Probe whether the browser will set a cookie scoped to `.candidate`. The browser refuses cookies
// on ICANN public suffixes (e.g. co.uk), so the broadest candidate that "sticks" is the
// registrable domain — no maintained TLD list required.
const canSetCookieOnDomain = candidate => {
    const probe = '__cb_tld_probe';
    document.cookie = `${probe}=1; domain=.${candidate}; path=/; SameSite=Lax`;
    const ok = document.cookie.indexOf(`${probe}=`) !== -1;
    document.cookie = `${probe}=; domain=.${candidate}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    return ok;
};

/**
 * Registrable domain for the preferences cookie, so consent is shared across subdomains.
 *
 * @param hostname [String] host to derive from (defaults to the current location)
 * @param canSet [Function] predicate testing whether the browser accepts a cookie on `.candidate`
 *                          (injectable so the resolution logic is unit-testable without the PSL)
 *
 * @returns [String] registrable domain, or '' for localhost/IP/failure (a safe host-only default)
 */
export const getRegistrableDomain = (hostname = window.location.hostname, canSet = canSetCookieOnDomain) => {
    try {
        if (hostname === 'localhost' || /^\d+(\.\d+){3}$/.test(hostname)) return '';
        const labels = hostname.replace(/^www\./, '').split('.');
        if (labels.length < 2) return '';

        let registrable = '';
        // Broadest (2 labels) → narrowest; first candidate the browser accepts wins.
        for (let k = 2; k <= labels.length; k++) {
            const candidate = labels.slice(-k).join('.');
            if (canSet(candidate)) {
                registrable = candidate;
                break;
            }
        }
        if (!registrable) return '';

        // If the browser accepted a known shared-hosting suffix, narrow to the app host so consent
        // is not shared across tenants.
        if (PRIVATE_SUFFIXES.indexOf(registrable) !== -1) {
            const extra = labels.length - registrable.split('.').length - 1;
            return extra < 0 ? '' : labels.slice(extra).join('.');
        }

        return registrable;
    } catch {
        return '';
    }
};

export const getFocusableChildren = node => Array.from(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(','))).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);

export const broadcast = (type, store) => () => {
    const event = new CustomEvent(type, {
        bubbles: true,
        detail: {
            getState: store.getState
        }
    });
    window.document.dispatchEvent(event);
};

export const renderIframe = () => {
    Array.from(document.querySelectorAll('[data-iframe-src]')).forEach(node => {
        const iframe = document.createElement('iframe');
        iframe.src = node.getAttribute('data-iframe-src');
        if (node.hasAttribute('data-iframe-height')) iframe.style.height = node.getAttribute('data-iframe-height');
        iframe.setAttribute('title', node.getAttribute('data-iframe-title') || 'iFrame embed');
        if (node.hasAttribute('data-iframe-width')) iframe.style.width = node.getAttribute('data-iframe-width') || '100%';
        iframe.setAttribute('tabindex', '0');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('webkitallowfullscreen', 'webkitallowfullscreen');
        iframe.setAttribute('mozallowfullscreen', 'mozallowfullscreen');
        iframe.setAttribute('allowfullscreen', 'allowfullscreen');
        node.parentNode.appendChild(iframe);
        node.parentNode.removeChild(node);
    });
};

export const gtmSnippet = id => {
    /* oxlint-disable no-unused-expressions, no-var -- minified Google Tag Manager vendor snippet, kept verbatim */
    !function(e, t, c, n, w, o) {
        e[n] = e[n] || [], e[n].push({
            "gtm.start": (new Date).getTime(),
            event: "gtm.js"
        });
        var r = t.getElementsByTagName(c)[0],
            s = t.createElement(c);
        s.async = !0, s.src = 'https://www.googletagmanager.com/gtm.js?id=' + w, r.parentNode.insertBefore(s, r)
    }(window, document, "script", "dataLayer", id);
    /* oxlint-enable no-unused-expressions, no-var */
};

function gtag() {
    window.dataLayer = window.dataLayer || [];
    //The Google libraries that use the dataLayer do not work if arguments are spread
    //or data is passed in as an array
    window.dataLayer.push(arguments);
}

export const setGoogleConsent = (store, pushType = 'update') => () => {
    const { settings, consent } = store.getState();
    const { euConsentTypes } = settings;
    if (!euConsentTypes) return;
    
    const euConsent = Object.keys(euConsentTypes).reduce((acc, type) => {
        if (Object.keys(consent).length > 0 && consent[euConsentTypes[type]] === undefined) {
            console.warn(`Cannot find consent type '${euConsentTypes[type]}' in preferences cookie, check your euConsentTypes configuration matches your cookie types`);
        }
        acc[type] = (consent[euConsentTypes[type]] && pushType === 'update') ? 'granted' : 'denied';
        return acc;
    }, {});
    if (pushType !== 'update') euConsent['wait_for_update'] = 500;

    gtag('consent', pushType, euConsent);
};
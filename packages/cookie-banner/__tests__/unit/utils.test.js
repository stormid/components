import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { groupValueReducer, removeSubdomain, extractFromCookie, broadcast, renderIframe, gtmSnippet } from '../../src/lib/utils.js';
import defaults from '../../src/lib/defaults.js';
import { EVENTS } from '../../src/lib/constants.js';
import { createStore } from '../../src/lib/store.js';

describe('Cookie > Utils > removeSubdomain', () => {
    it('should return the same vaule for a root domain', async () => {
        assert.deepStrictEqual(removeSubdomain('stormid.com'), 'stormid.com');
    });

    it('should remove www from a url', async () => {
        assert.deepStrictEqual(removeSubdomain('www.stormid.com'), 'stormid.com');
    });

    it('should remove sub sub domains from a domain', async () => {
        assert.deepStrictEqual(removeSubdomain('test.demo.stormid.com'), 'stormid.com');
    });

    it('should remove subsub sub domains from a domain', async () => {
        assert.deepStrictEqual(removeSubdomain('cookie.test.demo.stormid.com'), 'stormid.com');
    });

    it('should handle URLs with multi dot tdls', async () => {
        assert.deepStrictEqual(removeSubdomain('cookie.test.demo.stormid.co.uk'), 'stormid.co.uk');
    });

    it('should handle azurewebsites.net as a multi dot tdl', async () => {
        assert.deepStrictEqual(removeSubdomain('cookie-test-wip.azurewebsites.net'), 'cookie-test-wip.azurewebsites.net');
    });

    it('should handle netlify.app as a multi dot tdl', async () => {
        assert.deepStrictEqual(removeSubdomain('cookie-test-wip.netlify.app'), 'cookie-test-wip.netlify.app');
    });

});

describe('Cookie > Utils > groupValueReducer', () => {
    it('should return the String value given an input with a value', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), 'Test value');
    });
    it('should return an empty String given an input without a value and an initial empty string', async () => {
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="" />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), '');
    });
    it('should return an Array containing a String value given a checkable input with a value', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), ['Test value']);
    });
    it('should return an Array containing a String value given a checkable input with a value and an initial Array', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer([], field), ['Test value']);
    });
    it('should return an empty String given a checkable input that is not checked and an initial empty string', async () => {
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        assert.deepStrictEqual(groupValueReducer('', field), '');
    });
});


describe('Cookie > Utils > extractFromCookie > no cookie', () => {

    it('should return default hasCookie and content properties if no cookie', () => {
        const [hasCookie, consent ] = extractFromCookie(defaults);
        assert.deepStrictEqual(hasCookie, false);
        assert.deepStrictEqual(consent, {});
    });

});


describe('Cookie > Utils > extractFromCookie > malformed JSON cookie', () => {

    it('should return default hasCookie and content properties if cookie is not JSON and throws when decoding', () => {
        document.cookie = `${defaults.name}=${btoa('test')}`;
        const [hasCookie, consent ] = extractFromCookie(defaults);
        assert.deepStrictEqual(hasCookie, false);
        assert.deepStrictEqual(consent, {});
    });

});

describe('Cookie > Utils > extractFromCookie > category mismatch', () => {
    it('should return default hasCookie and content properties if categroies do not match', () => {
        document.cookie = `${defaults.name}=${btoa(JSON.stringify({ consent: { performance: 1, thirdParty: 0 } }))}`;
        const [hasCookie, consent ] = extractFromCookie({ ...defaults, types: { performance: {}, thirdParty: {}, ads: {} } });

        assert.deepStrictEqual(hasCookie, false);
        assert.deepStrictEqual(consent, { });
    });
});

describe('Cookie > Utils > extractFromCookie > well-formed JSON cookie', () => {
    it('should return hasCookie and content properties from well-formed JSON cookie', () => {
        document.cookie = `${defaults.name}=${btoa(JSON.stringify({ consent: { performance: 1, thirdParty: 0 } }))}`;
        const [hasCookie, consent ] = extractFromCookie({ ...defaults, types: { performance: {}, thirdParty: {} } });

        assert.deepStrictEqual(hasCookie, true);
        assert.deepStrictEqual(consent, { performance: 1, thirdParty: 0 });
    });
});

describe('Cookie > Utils > extractFromCookie > cookie not base64 encoded', () => {

    it('should return default hasCookie, and content properties if cookie is not base64 encoded and throws when decoding', () => {
        window.atob = mock.fn(() => {
            throw new Error();
        });
        document.cookie = `${defaults.name}="test"`;
        const [hasCookie, consent ] = extractFromCookie(defaults);
        assert.ok(window.atob.mock.callCount() > 0);
        assert.deepStrictEqual(hasCookie, false);
        assert.deepStrictEqual(consent, {});
    });

});

describe(`Cookie banner > Utils > broadcast`, () => {

    it('should dispatch a custom event with a detail Object with a reference to Store.getState', async () => {
        const Store = createStore();
        const state = {
            consent: {},
            bannerOpen: true,
            settings: defaults
        };
        Store.update(state);
        const listener = mock.fn();
        document.addEventListener(EVENTS.SHOW, listener);
        document.addEventListener(EVENTS.SHOW, e => {
            assert.deepStrictEqual(e.detail, { getState: Store.getState });
        });

        broadcast(EVENTS.SHOW, Store)(state);
        assert.ok(listener.mock.callCount() > 0);
    });

});

describe(`Cookie banner > Utils > renderIframe`, () => {

    it('should render an iframe to an element based on data attributes', async () => {
        const SRC = 'https://www.youtube.com/embed/qpLKTUQev30';
        const TITLE = 'Test video';
        const HEIGHT = `500px`;
        const WIDTH = `500px`;
        document.body.innerHTML = `<div
            data-iframe-src="${SRC}"
            data-iframe-title="${TITLE}"
            data-iframe-height="${HEIGHT}"
            data-iframe-width="${WIDTH}"
             />`;
        renderIframe();
        const iframe = document.querySelector('iframe');
        assert.deepStrictEqual(iframe.getAttribute('src'), SRC);
        assert.deepStrictEqual(iframe.getAttribute('title'), TITLE);
        assert.deepStrictEqual(iframe.style.height, HEIGHT);
        assert.deepStrictEqual(iframe.style.width, WIDTH);
    });

});

describe(`Cookie banner > Utils > gtmSnippet`, () => {

    it('should render a Google Tag Manager script tag', async () => {
        document.body.innerHTML = `<script></script>`; //gtm snippet needs a script already on the page to insertBefore
        gtmSnippet('ua-1234-5678');
        const gtmScript = document.querySelector('script');
        assert.notStrictEqual(gtmScript, undefined);
        assert.deepStrictEqual(gtmScript.src, 'https://www.googletagmanager.com/gtm.js?id=ua-1234-5678');
    });

});

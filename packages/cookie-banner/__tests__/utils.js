import { groupValueReducer, removeSubdomain, extractFromCookie, broadcast, renderIframe, gtmSnippet } from '../src/lib/utils';
import defaults from '../src/lib/defaults';
import { EVENTS } from '../src/lib/constants';
import { createStore } from '../src/lib/store';

describe('Cookie > Utils > removeSubdomain', () => {
    it('should return the same vaule for a root domain', async () => {
        expect(removeSubdomain('stormid.com')).toEqual('stormid.com');
    });

    it('should remove www from a url', async () => {
        expect(removeSubdomain('www.stormid.com')).toEqual('stormid.com');
    });

    it('should remove sub sub domains from a domain', async () => {
        expect(removeSubdomain('test.demo.stormid.com')).toEqual('stormid.com');
    });

    it('should remove subsub sub domains from a domain', async () => {
        expect(removeSubdomain('cookie.test.demo.stormid.com')).toEqual('stormid.com');
    });

    it('should handle URLs with multi dot tdls', async () => {
        expect(removeSubdomain('cookie.test.demo.stormid.co.uk')).toEqual('stormid.co.uk');
    });

    it('should handle azurewebsites.net as a multi dot tdl', async () => {
        expect(removeSubdomain('cookie-test-wip.azurewebsites.net')).toEqual('cookie-test-wip.azurewebsites.net');
    });

    it('should handle netlify.app as a multi dot tdl', async () => {
        expect(removeSubdomain('cookie-test-wip.netlify.app')).toEqual('cookie-test-wip.netlify.app');
    });

});

describe('Cookie > Utils > groupValueReducer', () => {
    it('should return the String value given an input with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('Test value');
    });
    it('should return an empty String given an input without a value and an initial empty string', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('');
    });
    it('should return an Array containing a String value given a checkable input with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual(['Test value']);
    });
    it('should return an Array containing a String value given a checkable input with a value and an initial Array', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer([], field)).toEqual(['Test value']);
    });
    it('should return an empty String given a checkable input that is not checked and an initial empty string', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('');
    });
});


describe('Cookie > Utils > extractFromCookie > no cookie', () => {

    it('should return default hasCookie and content properties if no cookie', () => {
        const [hasCookie, consent ] = extractFromCookie(defaults);
        expect(hasCookie).toEqual(false);
        expect(consent).toEqual({});
    });

});

    
describe('Cookie > Utils > extractFromCookie > malformed JSON cookie', () => {
    
    it('should return default hasCookie and content properties if cookie is not JSON and throws when decoding', () => {
        document.cookie = `${defaults.name}=${btoa(test)}`;
        const [hasCookie, consent ] = extractFromCookie(defaults);
        expect(hasCookie).toEqual(false);
        expect(consent).toEqual({});
    });
    
});

describe('Cookie > Utils > extractFromCookie > well-formed JSON cookie', () => {
    it('should return hasCookie and content properties from well-formed JSON cookie', () => {
        document.cookie = `${defaults.name}=${btoa(JSON.stringify({ consent: { performance: 1, thirdParty: 0 } }))}`;
        const [hasCookie, consent ] = extractFromCookie(defaults);
        
        expect(hasCookie).toEqual(true);
        expect(consent).toEqual({ performance: 1, thirdParty: 0 });
    });
});

describe('Cookie > Utils > extractFromCookie > cookie not base64 encoded', () => {

    it('should return default hasCookie, and content properties if cookie is not base64 encoded and throws when decoding', () => {
        window.atob = jest.fn();
        window.atob.mockImplementation(() => {
            throw new Error();
        });
        document.cookie = `${defaults.name}="test"`;
        const [hasCookie, consent ] = extractFromCookie(defaults);
        expect(window.atob).toHaveBeenCalled();
        expect(hasCookie).toEqual(false);
        expect(consent).toEqual({});
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
        Store.update(_ => _, state);
        const listener = jest.fn();
        document.addEventListener(EVENTS.OPEN, listener);
        document.addEventListener(EVENTS.OPEN, e => {
            expect(e.detail).toEqual({ getState: Store.getState });
        });

        broadcast(EVENTS.OPEN, Store)(state);
        expect(listener).toHaveBeenCalled();
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
        expect(iframe.getAttribute('src')).toEqual(SRC);
        expect(iframe.getAttribute('title')).toEqual(TITLE);
        expect(iframe.style.height).toEqual(HEIGHT);
        expect(iframe.style.width).toEqual(WIDTH);
    });

});

describe(`Cookie banner > Utils > gtmSnippet`, () => {

    it('should render a Google Tag Manager script tag', async () => {
        document.body.innerHTML = `<script></script>`; //gtm snippet needs a script already on the page to insertBefore
        gtmSnippet('ua-1234-5678');
        const gtmScript = document.querySelector('script');
        expect(gtmScript).toBeDefined();
        expect(gtmScript.src).toEqual('https://www.googletagmanager.com/gtm.js?id=ua-1234-5678');
    });

});
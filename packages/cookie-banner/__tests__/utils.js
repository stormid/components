import { groupValueReducer, removeSubdomain, extractFromCookie, checkTag } from '../src/lib/utils';
import defaults from '../src/lib/defaults';

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

    it('should return default hasCookie, cid, and content properties if no cookie', () => {
        const [hasCookie, cid, consent ] = extractFromCookie(defaults);
        expect(hasCookie).toEqual(false);
        expect(cid).toBeDefined();
        expect(consent).toEqual({});
    });

});

    
describe('Cookie > Utils > extractFromCookie > malformed JSON cookie', () => {
    
    it('should return default hasCookie, cid, and content properties if cookie is not JSON and throws when decoding', () => {
        document.cookie = `${defaults.name}=${btoa(test)}`;
        const [hasCookie, cid, consent ] = extractFromCookie(defaults);
        expect(hasCookie).toEqual(false);
        expect(cid).toBeDefined();
        expect(consent).toEqual({});
    });
    
});

describe('Cookie > Utils > extractFromCookie > well-formed JSON cookie', () => {
    it('should return hasCookie, cid, and content properties from well-formed JSON cookie', () => {
        document.cookie = `${defaults.name}=${btoa(JSON.stringify({ cid: '12345', consent: { performance: 1, thirdParty: 0 } }))}`;
        const [hasCookie, cid, consent ] = extractFromCookie(defaults);
        
        expect(hasCookie).toEqual(true);
        expect(cid).toEqual('12345');
        expect(consent).toEqual({ performance: 1, thirdParty: 0 });
    });
});

describe('Cookie > Utils > extractFromCookie > cookie not base64 encoded', () => {

    it('should return default hasCookie, cid, and content properties if cookie is not base64 encoded and throws when decoding', () => {
        window.atob = jest.fn();
        window.atob.mockImplementation(() => {
            throw new Error();
        });
        document.cookie = `${defaults.name}="test"`;
        const [hasCookie, cid, consent ] = extractFromCookie(defaults);
        expect(window.atob).toHaveBeenCalled();
        expect(hasCookie).toEqual(false);
        expect(cid).toBeDefined();
        expect(consent).toEqual({});
    });

});
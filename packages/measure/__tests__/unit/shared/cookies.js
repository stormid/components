import { readCookie, writeCookie } from '../../../src/lib/shared/cookies';
import { COOKIE_NAME, COOKIE_VALUE } from '../../../src/lib/constants';
const TWO_YEARS = 63072000000;

describe(`Measure > shared > cookies > writeCookie`, () => {
    it('Should sets a cookie based on an Object', async () => {
        const name = COOKIE_NAME;
        const value = `${COOKIE_VALUE}.12345`;

        const data = {
            name,
            value,
            expiry: new Date(new Date().getTime() + TWO_YEARS).toGMTString(),
            path: '/'
        };
        writeCookie(data);
        expect(document.cookie).toEqual(`${name}=${value}`);        
    });
});

describe(`Measure > shared > cookies > readCookie`, () => {
    it('Should return a Object with name and value properties for a matched cookie name', async () => {
        //cookie set in previous test...
        expect(readCookie({ name: COOKIE_NAME })).toEqual({ name: COOKIE_NAME, value: `${COOKIE_VALUE}.12345`});
    });

    it('Should ignore cookies for the same domain', async () => {
        //cookie we want is set in previous test...
        //we'll set one we don't want
        writeCookie({ name: 'Ignore me pls', value: '666', expiry: new Date(new Date().getTime() + TWO_YEARS).toGMTString()});
        expect(readCookie({ name: COOKIE_NAME })).toEqual({ name: COOKIE_NAME, value: `${COOKIE_VALUE}.12345`});
    });

    it('Should return false if the cookie is not found', async () => {
        //cookie we want is set in previous test...
        //we'll set one we don't want
        expect(readCookie({ name: 'Absent cookie' })).toEqual(false);
    });
});
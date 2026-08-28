import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import cookieBanner from '../../src/index.js';
import defaults from '../../src/lib/defaults.js';
import sampleTemplates from '../../example/src/js/sample-templates.js';

const types = {
    performance: {
        title: 'Performance preferences',
        description: 'Performance description',
        labels: { yes: 'yes', no: 'no' },
        fns: [() => { }]
    },
    ads: {
        title: 'Ads preferences',
        description: 'Ads description',
        labels: { yes: 'yes', no: 'no' },
        fns: [() => { }]
    }
};

const clearAllCookies = () => document.cookie.split('; ').forEach(cookie => {
    const name = cookie.split('=')[0];
    if (name) document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
});

const readCookieValue = name => {
    const match = document.cookie.split('; ').find(cookie => cookie.split('=')[0] === name);
    return match ? match.slice(match.indexOf('=') + 1) : undefined;
};

describe('Cookie banner > cookie clearing', () => {
    beforeEach(() => {
        clearAllCookies();
        document.body.innerHTML = `<main></main>`;
    });

    it('reject-all clears other cookies (deleteCookies runs on reject)', async () => {
        cookieBanner({ ...sampleTemplates, secure: false, types });
        document.cookie = 'unrelated=keep; path=/';
        assert.equal(readCookieValue('unrelated'), 'keep');

        document.querySelector(`.${defaults.classNames.rejectBtn}`).click();

        assert.equal(readCookieValue('unrelated'), undefined, 'reject should have wiped the unrelated cookie');
        // the consent cookie is re-written after the wipe
        assert.equal(readCookieValue(defaults.name), btoa(JSON.stringify({ consent: { performance: 0, ads: 0 } })));
    });

    it('reject-all re-runs necessary consent fns so essential cookies survive the wipe', async () => {
        const necessaryFn = () => { document.cookie = 'essential=1; path=/'; };
        cookieBanner({ ...sampleTemplates, secure: false, types, necessary: [necessaryFn] });
        // the necessary fn runs at init
        assert.equal(readCookieValue('essential'), '1');

        document.querySelector(`.${defaults.classNames.rejectBtn}`).click();

        // deleteCookies wiped it, but necessary re-ran on reject and recreated it (no reload needed)
        assert.equal(readCookieValue('essential'), '1', 'reject must re-run necessary fns to restore essential cookies');
    });

    it('accept-all leaves other cookies in place (deleteCookies does not run on accept)', async () => {
        cookieBanner({ ...sampleTemplates, secure: false, types });
        document.cookie = 'unrelated=keep; path=/';
        assert.equal(readCookieValue('unrelated'), 'keep');

        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();

        assert.equal(readCookieValue('unrelated'), 'keep', 'accept should not wipe the unrelated cookie');
        assert.equal(readCookieValue(defaults.name), btoa(JSON.stringify({ consent: { performance: 1, ads: 1 } })));
    });

    it('renders the banner without throwing when the body has no element children', async () => {
        document.body.innerHTML = '';
        assert.doesNotThrow(() => cookieBanner({ ...sampleTemplates, secure: false, types }));
        assert.notStrictEqual(document.querySelector(`.${defaults.classNames.banner}`), null);
    });
});

import { describe, it, before, mock } from 'node:test';
import assert from 'node:assert/strict';
import cookieBanner from '../../src/index.js';
import defaults from '../../src/lib/defaults.js';
import sampleTemplates from '../../example/src/js/sample-templates.js';

let instance;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<main></main>`;
    instance = cookieBanner({
        ...sampleTemplates,
        secure: false,
        types: {
            test: {
                title: 'Test title',
                description: 'Test description',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: [
                    () => { }
                ]
            },
            performance: {
                title: 'Performance preferences',
                description: 'Performance cookies are used to measure the performance of our website and make improvements. Your personal data is not identified.',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: [
                    () => { }
                ]
            }
        }
    });
};

describe(`Cookie banner > showBanner > show banner`, () => {
    before(init);

    it('It should not show the banner if is already showing', async () => {
        assert.notStrictEqual(document.querySelector(`.${defaults.classNames.banner}`), null);
        assert.strictEqual(instance.getState().bannerOpen, true);
        instance.showBanner();
        assert.strictEqual(document.querySelectorAll(`.${defaults.classNames.banner}`).length, 1);
    });

    it('It should show the banner and invoke the callback function', async () => {
        assert.notStrictEqual(document.querySelector(`.${defaults.classNames.banner}`), null);
        assert.strictEqual(instance.getState().bannerOpen, true);
        //hide it
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        assert.strictEqual(instance.getState().bannerOpen, false);
        assert.strictEqual(document.querySelector(`.${defaults.classNames.banner}`), null);

        //show it
        const cb = mock.fn();
        instance.showBanner(cb);
        assert.strictEqual(instance.getState().bannerOpen, true);
        assert.notStrictEqual(document.querySelector(`.${defaults.classNames.banner}`), null);
        const nextState = instance.getState();
        assert.ok(cb.mock.calls.some(c => { try { assert.deepStrictEqual(c.arguments, [nextState]); return true; } catch { return false; } }));
    });

});

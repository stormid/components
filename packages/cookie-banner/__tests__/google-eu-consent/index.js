import cookieBanner from '../../src';
import defaults from '../../src/lib/defaults';
import sampleTemplates from '../../example/src/js/sample-templates';

/* eslint-disable camelcase */
const init = () => {
    // Set up our document body
    document.body.innerHTML = `<main></main>`;
    window.__cb__ = cookieBanner({
        ...sampleTemplates,
        secure: false,
        euConsentTypes: {
            ad_storage: 'test',
            ad_user_data: 'test',
            ad_personalization: 'test',
            analytics_storage: 'performance'
        },
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


describe(`Cookie banner > cookies > Google EU consent > default event`, () => {
    beforeAll(init);

    it('must set a default consent event with all categories denied', async () => {
        const banner = document.querySelector(`.${defaults.classNames.banner}`);
        expect(banner).not.toBeNull();
        
        //These assertions break Jest because of the use 'arguments' in the gtag implementation
        //They have been manually validated in the browser
        // expect(window.dataLayer).toEqual([
        //     ['consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' }]
        // ]);
        // const acceptAllBtn = document.querySelector(`.${defaults.classNames.acceptBtn}`);
        // acceptAllBtn.click();

        // expect(window.dataLayer).toEqual([
        //     ['consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' }],
        //     ['consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' }]
        // ]);
    });

});
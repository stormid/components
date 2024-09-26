import cookieBanner from '../../src';
import defaults from '../../src/lib/defaults';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<main></main>`;
    window.__cb__ = cookieBanner({
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


describe(`Cookie banner > cookies > Google EU consent > no EU consent settings`, () => {
    beforeAll(init);

    it('No errors or pushes to dataLayer if no consent options configured', async () => {
        const banner = document.querySelector(`.${defaults.classNames.banner}`);
        expect(banner).not.toBeNull();
        expect(window.dataLayer).toBeUndefined();
    });

});
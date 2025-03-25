import cookieBanner from '../../src';
import defaults from '../../src/lib/defaults';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
    window.__cb__ = cookieBanner({
        secure: false,
        hideBannerOnFormPage: false,
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


describe(`Cookie banner > reject`, () => {
    beforeAll(init);

    it('Should reject all cookies whe the reject button is clicked', async () => {
        document.querySelector(`.${defaults.classNames.rejectBtn}`).click();
        expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":0,"performance":0}}`)}`);
    });

});


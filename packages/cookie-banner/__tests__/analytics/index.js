import cookieBanner from '../../src';
import sampleTemplates from '../../example/src/js/sample-templates';
import defaults from '../../src/lib/defaults';
let instance;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
    instance = cookieBanner({
        ...sampleTemplates,
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

describe(`Cookie banner > Analytics > Data layer additions`, () => {
    beforeAll(init);

    it('It should add to the dataLayer when the banner is shown', async () => {
        expect(dataLayer.find(e => e.event === "stormcb_display")).toBeDefined();
    });

    it('It should add to the datalayer when accept all is clicked', async () => {
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        expect(dataLayer.find(e => e.event === "stormcb_accept_all")).toBeDefined();
        expect(dataLayer.find(e => e.stormcb_performance === 1)).toBeDefined();
        expect(dataLayer.find(e => e.stormcb_test === 1)).toBeDefined();
    });

    it('It should add to the datalayer when reject all is clicked', async () => {
        instance.showBanner();
        document.querySelector(`.${defaults.classNames.rejectBtn}`).click();
        expect(dataLayer.find(e => e.event === "stormcb_reject_all")).toBeDefined();
        expect(dataLayer.find(e => e.stormcb_performance === 0)).toBeDefined();
        expect(dataLayer.find(e => e.stormcb_test === 0)).toBeDefined();
    });
});

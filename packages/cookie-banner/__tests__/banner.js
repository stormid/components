import cookieBanner from '../src';
import defaults from '../src/lib/defaults';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
    cookieBanner({
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


describe(`Cookie banner > DOM > render`, () => {
    beforeAll(init);

    it('It should render the banner', async () => {
        expect(document.querySelector(`.${defaults.classNames.banner}`)).not.toBeNull();
    });
});

describe(`Cookie banner > DOM > not render`, () => {

    it('It should not render the banner if hideBannerOnFormPage setting is true and on consent form page', async () => {
        document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
        cookieBanner({
            secure: false,
            hideBannerOnFormPage: true,
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
                }
            }
        });
        expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();
    });
});


describe(`Cookie banner > DOM > accessibility`, () => {
    beforeAll(init);
    it('The banner should be a dialog', async () => {
        expect(document.querySelector(`.${defaults.classNames.banner}`).getAttribute('role')).toEqual('dialog');
    });
    
    it('The banner should have be polite aria live region', async () => {
        expect(document.querySelector(`.${defaults.classNames.banner}`).getAttribute('aria-live')).toEqual('polite');
    });
    
    it('The banner should have an aria label', async () => {
        expect(document.querySelector(`.${defaults.classNames.banner}`).getAttribute('aria-label')).toBeDefined();
    });
    
});

describe(`Cookie banner > DOM > interactions`, () => {
    beforeAll(init);
    
    it('Hides the banner', async () => {
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();
    });

});


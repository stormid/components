import cookieBanner from '../../src';
import defaults from '../../src/lib/defaults';

describe(`Cookie banner > DOM > form > render by api`, () => {

    it('Should render the form via the API', async () => {
        document.body.innerHTML = `<main></main>`;
        const instance = cookieBanner({
            secure: false,
            hideBannerOnFormPage: false,
            types: {
                test: {
                    suggested: true,
                    title: 'Test title',
                    description: 'Test description',
                    labels: {
                        yes: 'Test yes label',
                        no: 'Test no label'
                    },
                    fns: [
                        () => { }
                    ]
                },
                performance: {
                    title: 'Performance preferences',
                    description: 'Performance cookies are used to measure the performance of our website and make improvements.',
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
        expect(document.querySelector(`.${defaults.classNames.form}`)).toBeNull();
        
        document.querySelector('main').innerHTML = `<div class="privacy-banner__form-container"></div>`;
        instance.renderForm();
        expect(document.querySelector(`.${defaults.classNames.form}`)).not.toBeNull();

    });

});
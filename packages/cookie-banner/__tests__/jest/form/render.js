import cookieBanner from '../../../src';
import defaults from '../../../src/lib/defaults';

describe(`Cookie banner > DOM > form > render`, () => {
    beforeAll(() => {
        document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
        cookieBanner({
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
    });

    it('Should render the form', async () => {
        expect(document.querySelector(`.${defaults.classNames.form}`)).not.toBeNull();
    });

    it('Should render a fieldset for each type', async () => {
        const fieldset = Array.from(document.querySelectorAll(`.${defaults.classNames.fieldset}`));
        const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
        expect(fieldset.length).toEqual(2);
        expect(fields.length).toEqual(4);
    });

    it('Should set the default values if any are set and no there is no user consent preferences', async () => {
        const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
        expect(fields[0].checked).toEqual(true);
    });

});
import cookieBanner from '../../../src';
import defaults from '../../../src/lib/defaults';

const dispatchSyntheticEvent = (node, eventType) => {
    let event = document.createEvent('Event');
    event.initEvent(eventType, true, true);
    node.dispatchEvent(event);
};

describe(`Cookie banner > DOM > form interactions`, () => {
    beforeAll(() => {
        document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
        window.__cb__ = cookieBanner({
            secure: false,
            hideBannerOnFormPage: false,
            types: {
                test: {
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
    
    it('Submit button should be disabled', async () => {
        expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).not.toBeNull();
    });

    it('Submit button should be enabled if both field groups have values', async () => {
        const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));

        fields[0].checked = true;
        dispatchSyntheticEvent(fields[0], 'change');//for JSDOM
        expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).not.toBeNull();

        fields[2].checked = true;
        dispatchSyntheticEvent(fields[2], 'change');//for JSDOM
        expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).toEqual(null);
    });

    it('Submit button should set the cookie and hide the banner', async () => {
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":1,"performance":1}}`)}`);
        expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();
    });
});
import CookieBanner from '../src';
import defaults from '../src/lib/defaults';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
    CookieBanner.init({ 
        secure: false,
        types: { 
            'test': {
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
            'performance': {
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


describe(`Privacy banner > DOM > form > render`, () => {
    beforeAll(init);

    it('Should render the form', async () => {
        expect(document.querySelector(`.${defaults.classNames.form}`)).not.toBeNull();
    });

    it('Should render a fieldset for each type', async () => {
        const fieldset = Array.from(document.querySelectorAll(`.${defaults.classNames.fieldset}`));
        const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
        expect(fieldset.length).toEqual(2);
        expect(fields.length).toEqual(4);
    });
    //titles, descriptions, labels
})

describe(`Privacy banner > DOM > form interactions`, () => {
    beforeAll(init);
    
    it('Submit button should be disabled', async () => {
        expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).not.toBeNull();
    });

    it('Submit button should be enabled if both field groups have values', async () => {
        const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));

        fields[0].checked = true;
        expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).not.toBeNull();

        fields[2].checked = true;
        expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).toEqual('');
    });

    it('Submit button should set the cookie and hide te banner', async () => {
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        
        expect(document.cookie).toEqual(`${defaults.name}={"test":1,"performance":1}`);
        expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();
 
    });
});


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


describe(`Rendering the banner`, () => {
    beforeAll(init);
    it('It should render the banner', async () => {
        expect(document.querySelector(`.${defaults.classNames.banner}`)).not.toBeNull();
    });

});

describe(`Accessibility`, () => {
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

describe(`Set consent cookies`, () => {
    beforeAll(init);

    it('Sets a cookie based on accept button', async () => {
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        expect(document.cookie).toEqual(`${defaults.name}={"test":1,"performance":1}`);        
    });

    it('Hides the banner', async () => {
        expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();        
    });

});

describe(`Rendering the form`, () => {
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


});
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


describe(`Cookie banner > cookies > accept`, () => {
    beforeAll(init);

    it('Sets a cookie based on accept button', async () => {
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        expect(document.cookie).toEqual(`${defaults.name}={"test":1,"performance":1}`);        
    });

});

describe(`Cookie banner > cookies > update`, () => {
    beforeAll(init);

    it('Sets a cookie based on preferences form', async () => {
        expect(document.cookie).toEqual(`${defaults.name}={"test":1,"performance":1}`);

        const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
        fields[1].checked = true;
        fields[3].checked = true;
        document.querySelector(`.${defaults.classNames.submitBtn}`).click();
        expect(document.cookie).toEqual(`${defaults.name}={"test":0,"performance":0}`);
    });

});


import cookieBanner from '../../../src';
import defaults from '../../../src/lib/defaults';

describe(`Cookie banner > DOM > form > not render`, () => {
    document.body.innerHTML = `<div></div>`;
    cookieBanner({
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
    
    it('Should return if there is no form container', async () => {
        expect(document.querySelector(`.${defaults.classNames.form}`)).toBeNull();
    });

});
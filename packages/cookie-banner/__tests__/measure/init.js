import cookieBanner from '../../src';
import defaults from '../../src/lib/defaults';

describe(`Cookie banner > measure > init`, () => {

    it('It should console.warn if no tid is supplied', async () => {
        console.warn = jest.fn();
        document.body.innerHTML = `<main />`;
        cookieBanner({
            tid: '',
            secure: false,
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
        expect(console.warn).toBeCalledWith('The tid setting is missing. A tid is required for banner measurements.');
    });

    it('should not render the banner if preferences are saved but there is no cid, and no tid has been provided in settings', () => {
        //set preference cookies, but not cid
        document.cookie = `${defaults.name}=${btoa(`{"consent":{"test":1}}`)}`;
        document.body.innerHTML = `<main />`;
        cookieBanner({
            tid: '',
            secure: false,
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
    })

});
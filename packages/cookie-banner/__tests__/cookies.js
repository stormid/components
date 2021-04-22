import cookieBanner from '../src';
import defaults from '../src/lib/defaults';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
    window.__cb__ = cookieBanner({
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


describe(`Cookie banner > cookies > update`, () => {
    beforeAll(init);

    it('Sets a cookie based on preferences form', async () => {
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        //get the cid from state
        const cid = window.__cb__.getState().persistentMeasurementParams.cid;
        expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":1,"performance":1},"cid":"${cid}"}`)}`);

        const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
        fields[1].checked = true;
        fields[3].checked = true;
        document.querySelector(`.${defaults.classNames.submitBtn}`).click();
        expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":0,"performance":0},"cid":"${cid}"}`)}`);
    });

});


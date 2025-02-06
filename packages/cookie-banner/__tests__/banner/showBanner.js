import cookieBanner from '../../src';
import defaults from '../../src/lib/defaults';

let instance;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<main></main>`;
    instance = cookieBanner({
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

describe(`Cookie banner > showBanner > show banner`, () => {
    beforeAll(init);

    it('It should not show the banner if is already showing', async () => {
        expect(document.querySelector(`.${defaults.classNames.banner}`)).not.toBeNull();
        expect(instance.getState().bannerOpen).toBe(true);
        instance.showBanner();
        expect(document.querySelectorAll(`.${defaults.classNames.banner}`).length).toBe(1);
    });

    it('It should show the banner and invoke the callback function', async () => {
        expect(document.querySelector(`.${defaults.classNames.banner}`)).not.toBeNull();
        expect(instance.getState().bannerOpen).toBe(true);
        //hide it
        document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
        expect(instance.getState().bannerOpen).toBe(false);
        expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();

        //show it
        const cb = jest.fn();
        instance.showBanner(cb);
        expect(instance.getState().bannerOpen).toBe(true);
        expect(document.querySelector(`.${defaults.classNames.banner}`)).not.toBeNull();
        const nextState = instance.getState();
        expect(cb).toHaveBeenCalledWith(nextState);
    });

});
import cookieBanner from '../src';
import { updateConsent, updateExecuted } from '../src/lib/reducers';

const init = () => {
    // Set up container for form
    document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;

};

describe(`Cookie banner > state > init`, () => {
    beforeAll(init);

    it('Should return the Store.getState method on initialisation', async () => {
        const Store = cookieBanner({ types: {}, tid: 'UA-XXXXX-Y' });
        expect(Store.getState).not.toBeUndefined();
    });

    it('Should return the state Object from Store.getState', async () => {
        const Store = cookieBanner({ types: {}, tid: 'UA-XXXXX-Y' });

        expect(Store.getState()).toBeDefined();
        expect(Store.getState().consent).toEqual({});
        expect(Store.getState().persistentMeasurementParams).toBeDefined();
        expect(Store.getState().settings).toBeDefined();
    });

});

describe(`Cookie banner > state > update/reducers`, () => {
    beforeAll(init);

    it('initialState should set the initial state based on options', async () => {
        const types = {
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
        };
        const Store = cookieBanner({ tid: 'UA-XXXXX-Y', types });

        expect(Store.getState().settings.types).toEqual(types);
    });


    it('updateConsent reducer should set consent based on data', async () => {
        const types = {
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
            test2: {
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
        };
        const state = { settings: {tid: 'UA-XXXXX-Y', types} };
        const data = { test: 1, test2: 0 };
        expect(updateConsent(state, data)).toEqual({
            consent: {
                test: 1, test2: 0
            },
            settings: {
                types,
                tid: 'UA-XXXXX-Y'
            }
        });
    });

    it('updateExecuted reducer should set executed property based on data', async () => {
        const types = {
            test: {
                title: 'Test title',
                description: 'Test description',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: []
            },
            test2: {
                title: 'Test title',
                description: 'Test description',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: []
            }
        };
        const state = { settings: { types, tid: 'UA-XXXXX-Y' }, consent: { test: 1, test2: 0 } };
        const data = {
            test: {
                executed: true,
                title: 'Test title',
                description: 'Test description',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: []
            },
            test2: {
                executed: true,
                title: 'Test title',
                description: 'Test description',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: []
            }
        };
        expect(updateExecuted(state, data)).toEqual({
            consent: { test: 1, test2: 0 },
            settings: {
                tid: 'UA-XXXXX-Y',
                types: {
                    test: {
                        executed: true,
                        title: 'Test title',
                        description: 'Test description',
                        labels: {
                            yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                            no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                        },
                        fns: []
                    },
                    test2: {
                        executed: true,
                        title: 'Test title',
                        description: 'Test description',
                        labels: {
                            yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                            no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                        },
                        fns: []
                    }
                }
            }
        });
    }); 
});
import cookieBanner from '../../src';
import { updateConsent, updateExecuted } from '../../src/lib/reducers';

const init = () => {
    // Set up container for form
    document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;

};

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
        const Store = cookieBanner({ types });

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
        const state = { settings: { types } };
        const data = { test: 1, test2: 0 };
        expect(updateConsent(state, data)).toEqual({
            consent: {
                test: 1, test2: 0
            },
            settings: {
                types
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
        const state = { settings: { types }, consent: { test: 1, test2: 0 } };
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
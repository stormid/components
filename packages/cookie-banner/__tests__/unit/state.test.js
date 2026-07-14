import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import cookieBanner from '../../src/index.js';
import { updateConsent, updateExecuted } from '../../src/lib/reducers.js';
import sampleTemplates from '../../example/src/js/sample-templates.js';

const init = () => {
    // Set up container for form
    document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;

};

describe(`Cookie banner > state > update/reducers`, () => {
    before(init);

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
        const Store = cookieBanner({ ...sampleTemplates, types });

        // Jest's toEqual ignored undefined-valued properties; node:assert's
        // deepStrictEqual does not. Init runs the `executed` reducer, which sets
        // types.test.executed to undefined (no consent yet), so reflect that here.
        assert.deepStrictEqual(Store.getState().settings.types, {
            test: { ...types.test, executed: undefined }
        });
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
        assert.deepStrictEqual(updateConsent(state, data), {
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
        assert.deepStrictEqual(updateExecuted(state, data), {
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

import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import cookieBanner from '../../src/index.js';
import { updateConsent, updateExecuted } from '../../src/lib/reducers.js';
import sampleTemplates from '../../example/src/js/sample-templates.js';

const domainTypes = { perf: { title: 't', description: 'd', labels: { yes: 'y', no: 'n' }, fns: [() => { }] } };

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

        // Init runs the `executed` reducer, which sets types.test.executed to a boolean derived
        // from consent — false here, since there is no consent yet.
        assert.deepStrictEqual(Store.getState().settings.types, {
            test: { ...types.test, executed: false }
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

describe(`Cookie banner > state > cookie domain`, () => {
    beforeEach(() => { document.body.innerHTML = `<main></main>`; });

    it('derives the domain once into state when not provided (host-only on localhost)', async () => {
        const instance = cookieBanner({ ...sampleTemplates, secure: false, types: domainTypes });
        assert.strictEqual(instance.getState().settings.domain, '');
    });

    it('respects an explicitly provided domain rather than deriving one', async () => {
        const instance = cookieBanner({ ...sampleTemplates, secure: false, types: domainTypes, domain: '.example.com' });
        assert.strictEqual(instance.getState().settings.domain, '.example.com');
    });

    it('treats an explicit empty-string domain as host-only, not as unset', async () => {
        const instance = cookieBanner({ ...sampleTemplates, secure: false, types: domainTypes, domain: '' });
        assert.strictEqual(instance.getState().settings.domain, '');
    });
});

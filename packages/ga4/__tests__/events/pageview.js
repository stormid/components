import ga4 from '../src';

describe(`GA4 > event > page view`, () => {
    Object.defineProperty(window, 'navigator', {
        value: navigator,
        writable: true
    });
    
    it('should ', () => {
        global.navigator = {
            sendBeacon: jest.fn()
        };

    });

});
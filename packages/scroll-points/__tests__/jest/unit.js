import { callback } from '../../src/lib/factory';
import defaults from '../../src/lib/defaults';

describe('Scroll points > unit > callback', () => {

    it('should do nothing if the entry is not intersecting', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: false }];
        const observer = { disconnect: () => {} };
        callback({ settings, node })(entries, observer);

        expect(node.classList.contains(defaults.className)).toEqual(false);
    });

    it('should change className if entries[0] is intersecting', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: () => {} };
        callback({ settings, node })(entries, observer);

        expect(node.classList.contains(defaults.className)).toEqual(true);
    });

    it('should invoke callback if intersecting and settings.callback defined', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const mockCallback = jest.fn();
        const node = document.querySelector('.test');
        const settings = Object.assign({}, defaults, { callback: mockCallback });
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: () => {} };
        callback({ settings, node })(entries, observer);

        expect(mockCallback).toBeCalled();
    });

    it('should invoke disconnect if intersecting and settings.unload truthy', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const mockDisconnect = jest.fn();
        const node = document.querySelector('.test');
        const settings = defaults;
        const entries = [{ isIntersecting: true }];
        const observer = { disconnect: mockDisconnect };
        callback({ settings, node })(entries, observer);

        expect(mockDisconnect).toBeCalledWith(node);
    });

    it('should remove className if entries[0] is not intersecting and replay and unload options set to allow replaying', () => {
        document.body.innerHTML = '<div class="test"></div>';
        const node = document.querySelector('.test');
        const settings = { ...defaults, replay: true, unload: false };
        const observer = { disconnect: () => {} };
        callback({ settings, node })([{ isIntersecting: true }], observer);
        expect(node.classList.contains(defaults.className)).toEqual(true);
        
        callback({ settings, node })([{ isIntersecting: false }], observer);
        expect(node.classList.contains(defaults.className)).toEqual(false);
    });


});
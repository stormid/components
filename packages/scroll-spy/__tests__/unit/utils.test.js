import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { rafThrottle } from '../../src/lib/utils.js';

describe('Scroll spy > utils > rafThrottle', () => {

    it('should schedule one frame per burst and run the wrapped function only when the frame fires', () => {
        const frames = [];
        const raf = mock.method(window, 'requestAnimationFrame', cb => frames.push(cb));
        const fn = mock.fn();
        const throttled = rafThrottle(fn);

        throttled();
        throttled();
        throttled();
        assert.strictEqual(raf.mock.callCount(), 1); //calls in the same frame are coalesced
        assert.strictEqual(fn.mock.callCount(), 0); //nothing runs until the frame fires

        frames[0]();
        assert.strictEqual(fn.mock.callCount(), 1);

        throttled(); //a fresh frame can be scheduled once the previous has fired
        assert.strictEqual(raf.mock.callCount(), 2);

        raf.mock.restore();
    });

    it('should forward arguments to the wrapped function', () => {
        const frames = [];
        const raf = mock.method(window, 'requestAnimationFrame', cb => frames.push(cb));
        const fn = mock.fn();
        rafThrottle(fn)('a', 'b');
        frames[0]();
        assert.deepStrictEqual(fn.mock.calls[0].arguments, ['a', 'b']);
        raf.mock.restore();
    });

});

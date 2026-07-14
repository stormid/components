import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import toggle from '../../src/index.js';
import { EVENTS } from '../../src/lib/constants.js';

describe('Toggle > lifecycle > prehook', () => {
    let prehookToggle, prehook;
    beforeEach(() => {
        document.body.innerHTML = `<button class="js-toggle__prehook-btn">Test toggle</button>
            <div id="target-2" class="js-toggle__prehook" data-toggle="js-toggle__prehook-btn"></div>`;
        prehook = mock.fn();
        prehookToggle = toggle('.js-toggle__prehook', {
            prehook
        })[0];
    });

    it('should bypass the prehook if toggle is invoked outwith lifecycle', () => {
        prehookToggle.toggle();
        assert.strictEqual(prehook.mock.callCount(), 0);
    });

    it('should call the prehook before toggle with node, toggles and isOpen properties of state', () => {
        const { node, toggles } = prehookToggle.getState();
        prehookToggle.startToggle();
        // Mirrors Jest's toHaveBeenCalledWith: assert some call matched these args
        const calledWith = prehook.mock.calls.some(call => {
            try {
                assert.deepStrictEqual(call.arguments, [{ node, toggles, isOpen: false }]);
                return true;
            } catch {
                return false;
            }
        });
        assert.ok(calledWith);
    });
});

describe('Toggle > events', () => {

    it('should dispatch an custom event when opening and closing with a reference to the instance getState', () => {

        document.body.innerHTML = `<button class="js-toggle__events-btn">Test toggle</button>
        <div id="target--events" class="js-toggle__events" data-toggle="js-toggle__events-btn"></div>`;
        const instance = toggle('.js-toggle__events')[0];
        const node = document.getElementById('target--events');
        const button = document.querySelector('.js-toggle__events-btn');

        const listener = mock.fn();
        node.addEventListener(EVENTS.OPEN, listener);
        node.addEventListener(EVENTS.OPEN, e => {
            assert.notStrictEqual(e.detail.getState, undefined);
            assert.strictEqual(e.detail.getState().node, node);
            assert.strictEqual(e.detail.getState().isOpen, true);
        });

        node.addEventListener(EVENTS.CLOSE, listener);
        node.addEventListener(EVENTS.CLOSE, e => {
            assert.notStrictEqual(e.detail.getState, undefined);
            assert.strictEqual(e.detail.getState().node, node);
            assert.strictEqual(e.detail.getState().isOpen, false);
        });

        //start closed
        assert.strictEqual(instance.getState().isOpen, false);

        //open
        button.click();
        assert.strictEqual(instance.getState().isOpen, true);
        assert.ok(listener.mock.callCount() > 0);

        //close
        button.click();
        assert.strictEqual(instance.getState().isOpen, false);
        assert.ok(listener.mock.callCount() > 0);
    });
});

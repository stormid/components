import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getStateFromDOM } from '../../src/lib/dom.js';

describe('Toggle > getStateFromDOM', () => {

    it('should resolve classTarget, statusClass and shouldStartOpen from DOM with initial open state', () => {

        document.body.innerHTML = `<div class="is--active"><button class="js-toggle__btn">Test toggle</button>
            <div id="exp-section" class="js-toggle-local" data-toggle="js-toggle__btn"></div>
        </div>`;

        const settings = { local: true };
        const node = document.querySelector('#exp-section');
        const { classTarget, statusClass, shouldStartOpen } = getStateFromDOM(node, settings);

        assert.strictEqual(classTarget, node.parentNode);
        assert.strictEqual(statusClass, 'is--active');
        assert.strictEqual(shouldStartOpen, true);
    });

});

import { getStateFromDOM } from '../../src/lib/dom';

describe(`Toggle > getStateFromDOM`, () => {

    it('should resolve classTarget, statusClass and shouldStartOpen from DOM with initial open state', async () => {

        document.body.innerHTML = `<div class="is--active"><button class="js-toggle__btn">Test toggle</button>
            <div id="exp-section" class="js-toggle-local" data-toggle="js-toggle__btn"></div>
        </div>`;

        const settings = { local: true };
        const node = document.querySelector('#exp-section');
        const { classTarget, statusClass, shouldStartOpen } = getStateFromDOM(node, settings);

        expect(classTarget).toEqual(node.parentNode);
        expect(statusClass).toEqual('is--active');
        expect(shouldStartOpen).toEqual(true);
    });

});
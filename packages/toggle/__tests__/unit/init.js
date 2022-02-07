import toggle from '../../src';
import { getSelection } from '../../src';

let Toggles, ToggleLocals;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<a tabindex="0" id="btn-1-1" href="#target-1" class="js-toggle_btn">Test toggle</a>
        <a href="#target-1" class="js-toggle_btn">Test toggle</a>
        <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn">
            <div id="focusable-1-1" tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
        </div>
        
        <button id="target-4" class="js-toggle__btn-2">Test toggle</button>
        <div id="target-4" class="js-toggle-local" data-toggle="js-toggle__btn-2" data-start-open="true"></div>`;

    Toggles = toggle('.js-toggle', {
        trapTab: true,
        closeOnBlur: true,
        focus: true
    });
    ToggleLocals = toggle('.js-toggle-local', { local: true });
};


describe(`Toggle > Init`, () => {
    
    beforeAll(init);

    it('should return array of length 2', async () => {
        expect(Toggles.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(Toggles[0]).not.toBeNull();
        expect(Toggles[0].node).not.toBeNull();
        expect(Toggles[0].startToggle).not.toBeNull();
        expect(Toggles[0].toggle).not.toBeNull();
        expect(Toggles[0].getState).not.toBeNull();
    });

    it('should return without throwing if no DOM nodes are found', () => {
        expect(toggle('.js-not-found')).toBeUndefined();
    });

    it('should use data attributes as settings, overriding options', () => {
        expect(ToggleLocals[0].getState().settings.startOpen).toEqual('true');
        expect(ToggleLocals[0].getState().isOpen).toEqual(true);
    });

});

describe('Toggle > Initialisation > Get Selection', () => {

    // Set up our document body
    const setupDOM = () => {
        document.body.innerHTML = `<a tabindex="0" id="btn-1-1" href="#target-1" class="js-toggle_btn">Test toggle</a>
        <a href="#target-1" class="js-toggle_btn">Test toggle</a>
        <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn">
            <div id="focusable-1-1" tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
        </div>
        
        <button id="target-4" class="js-toggle__btn-2">Test toggle</button>
        <div id="target-4" class="js-toggle-local" data-toggle="js-toggle__btn-2" data-start-open="true"></div>`;
    }

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const toggles = document.querySelector('.js-toggle');
        const els = getSelection(toggles);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const toggles = document.querySelectorAll('.js-toggle');
        const els = getSelection(toggles);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const toggles = document.querySelector('.js-toggle');
        const els = getSelection([toggles]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-toggle');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});
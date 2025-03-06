import textarea from '../../src';
import { getSelection } from '../../src/lib/utils';

let Textareas;

const init = () => {
    document.body.innerHTML = `<textarea rows="1"></textarea>`;
    Textareas = textarea('textarea');
};

describe(`Textarea > initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
        expect(Textareas.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(Textareas[0]).not.toBeNull();
        expect(Textareas[0].node).not.toBeNull();
        expect(Textareas[0].update).not.toBeNull();
    });

});

describe('Textarea > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<textarea rows="1"></textarea>`;
    }

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const textarea = document.querySelector('textarea');
        const els = getSelection(textarea);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const textarea = document.querySelectorAll('textarea');
        const els = getSelection(textarea);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const textarea = document.querySelector('textarea');
        const els = getSelection([textarea]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('textarea');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});

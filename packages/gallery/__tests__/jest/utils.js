import { sanitise, getIndexFromURL, getSelection } from '../../src/lib/utils';

describe('Gallery > Utils > sanitize', () => {

    it('should replace ampersands with HTML entity', () => {
        expect(sanitise('test&test&test&test')).toEqual('test&amp;test&amp;test&amp;test');
    });

    it('should replace code block open braces with HTML entity less than', () => {
        expect(sanitise('<test')).toEqual('&lt;test');
    });

    it('should replace code close open braces with HTML entity greater than', () => {
        expect(sanitise('test>')).toEqual('test&gt;');
    });

    it('should replace ampersands, open, and close blocks with non-JS executable HTML entities', () => {
        expect(sanitise('<img src="x" onerror="alert(1)" >Image alert')).toEqual('&lt;img src="x" onerror="alert(1)" &gt;Image alert');
    });

});

describe('Gallery > getIndexFromURL', () => {

    it('Should return fallback if no hash', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL([], '');
        expect(result).toEqual(false);
        warn.mockRestore();
    });
    
    it('Should return fallback if hash does not contain gallery item id', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL([], '#potato');
        expect(result).toEqual(false);
        warn.mockRestore();
    });

    it('Should return index if one is found', () => {
        const result = getIndexFromURL([
            { id: 'gallery-1-1' },
            { id: 'gallery-1-2' }], '#gallery-1-2');

        expect(result).toEqual(1);
    });

    it('Should return fallback passed as argument if no item matching hash', () => {
        const result = getIndexFromURL([], '#gallery-1-2', 'fallback');

        expect(result).toEqual('fallback');
    });


});


describe('Gallery > Utils > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<div class="js-gallery test"></div>`;
    };

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const node = document.querySelector('.js-gallery');
        const els = getSelection(node);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const node = document.querySelectorAll('.js-gallery');
        const els = getSelection(node);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const node = document.querySelector('.js-gallery');
        const els = getSelection([node]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-gallery');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});
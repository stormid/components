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
    //return fallback if url.split throws
    it('Should return fallback if url.split throws', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL('test-name', [], '#');
        expect(result).toEqual(0);
        warn.mockRestore();
    });
    
    it('Should return fallback if hash does not contain gallery name', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL('test-name', [], '#potato');
        expect(result).toEqual(0);
        warn.mockRestore();
    });
    
    it('Should return fallback and console warn if hash does not contain a number', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL('test-name', [], '#test-name-potato');
        expect(result).toEqual(0);
        expect(warn).toHaveBeenCalledWith('Gallery hash not valid');
        warn.mockRestore();
    });

    it('Should return fallback and console warn if index is out of bounds', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL('test-name', [{}, {}], '#test-name-4');
        expect(result).toEqual(0);
        expect(warn).toHaveBeenCalledWith('Gallery index out of bounds');
        warn.mockRestore();
    });

    it('Should return index if one is found', () => {
        const result = getIndexFromURL('test-name', [{}, {}], '#test-name-1');
        //index is one less than the number in the hash
        expect(result).toEqual(0);
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
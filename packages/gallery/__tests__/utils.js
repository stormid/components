import { sanitise, getIndexFromURL } from '../src/lib/utils';

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

//composeItems

//composeDOM

//getIndexFromURL
// export const getIndexFromURL = (name, items, url, fallback = false) => {
//     try {
//         const hash = url.split(`#`)[1];
//         if (hash.indexOf(`${name}-`) === -1) return fallback;
//         const num = Number(hash.split(`${name}-`)[1]);
//         if (isNaN(num)) throw 'Gallery hash not valid';
//         const index = num - 1;
//         if (index < 0 || index > (items.length - 1)) throw 'Gallery index out of bounds';
//         return index;
//     } catch (e){
//         return fallback;
//     }
// };
describe('Gallery > getIndexFromURL', () => {
    //return fallback if url.split throws
    it('Should return fallback if url.split throws', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL('test-name', [], '#');
        expect(result).toEqual(false);
        warn.mockRestore();
    });
    
    it('Should return fallback if hash does not contain gallery name', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL('test-name', [], '#potato');
        expect(result).toEqual(false);
        warn.mockRestore();
    });
    
    it('Should return fallback and console warn if hash does not contain a number', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL('test-name', [], '#test-name-potato');
        expect(result).toEqual(false);
        expect(warn).toHaveBeenCalledWith('Gallery hash not valid');
        warn.mockRestore();
    });

    it('Should return fallback and console warn if index is out of bounds', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = getIndexFromURL('test-name', [{}, {}], '#test-name-4');
        expect(result).toEqual(false);
        expect(warn).toHaveBeenCalledWith('Gallery index out of bounds');
        warn.mockRestore();
    });

    it('Should return index if one is found', () => {
        const result = getIndexFromURL('test-name', [{}, {}], '#test-name-1');
        //index is one less than the number in the hash
        expect(result).toEqual(0);
    });


});
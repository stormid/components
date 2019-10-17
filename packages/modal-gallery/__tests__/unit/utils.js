import { sanitize } from '../../src/lib/utils';

describe('Modal Gallery > Utils > sanitize', () => {

    it('should replace ampersands with HTML entity', () => {
        expect(sanitize('test&test&test&test')).toEqual('test&amp;test&amp;test&amp;test');
    });

    it('should replace code block open braces with HTML entity less than', () => {
        expect(sanitize('<test')).toEqual('&lt;test');
    });

    it('should replace code close open braces with HTML entity greater than', () => {
        expect(sanitize('test>')).toEqual('test&gt;');
    });

    it('should replace ampersands, open, and close blocks with non-JS executable HTML entities', () => {
        expect(sanitize('<img src="x" onerror="alert(1)" >Image alert')).toEqual('&lt;img src="x" onerror="alert(1)" &gt;Image alert');
    });

});
import '../src';

describe('Outliner', () => {
    const mousedown = new Event('mousedown', { bubbles: false, cancelable: false });
    const keydown = new Event('keydown', { bubbles: false, cancelable: false });

    it('should attach a mousedown eventListener that edits a style tag in the head', () => {
        document.dispatchEvent(mousedown);
        expect(document.getElementsByTagName('STYLE')[0].innerHTML).toEqual('*:focus{outline:none !important}');
    });

    it('should attach a keydown eventListener', async () => {
        document.dispatchEvent(keydown);
        // ;_;
        setTimeout(() => {
            expect(document.getElementsByTagName('STYLE')[0]).toEqual('');
        }, 0);
        
    });
});

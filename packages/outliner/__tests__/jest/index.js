import '../../src';

describe('Outliner', () => {
    const mousedown = new Event('mousedown', { bubbles: false, cancelable: false });
    const keydown = new Event('keydown', { bubbles: false, cancelable: false });

    it('should attach a mousedown eventListener that adds a className to the documentElement', () => {
        document.dispatchEvent(mousedown);
        expect(document.documentElement.classList.contains('no-outline')).toEqual(true);
    });

    it('should attach a keydown eventListener that removes the className', async () => {
        document.dispatchEvent(keydown);
        expect(document.documentElement.classList.contains('no-outline')).toEqual(false);
    });
});

import Toggle from '../../src';

let Toggles;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<a tabindex="0" id="btn-1-1" href="#target-1" class="js-toggle_btn">Test toggle</a>
        <a href="#target-1" class="js-toggle_btn">Test toggle</a>
        <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn"><div id="focusable-1-1" tabindex="0">Test focusable content</div><div tabindex="0">Test focusable content</div><div tabindex="0">Test focusable content</div></div>`;

    Toggles = Toggle.init('.js-toggle', {
		trapTab: true,
		closeOnBlur: true,
		focus: true
	});
};


describe(`Init`, () => {
    
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
        expect(Toggle.init('.js-no-found')).toBeUndefined();
    });


});

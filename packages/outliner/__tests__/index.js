import '../src';

describe("Outliner", () => {
	const mousedown = document.createEvent("HTMLEvents");
	const keydown = document.createEvent("HTMLEvents");

	it('should attach a mousedown eventListener that edits a style tag in the head', () => {
		mousedown.initEvent("mousedown", false, true);
		document.dispatchEvent(mousedown);
		expect(document.getElementsByTagName('STYLE')[0].innerHTML).toEqual('*:focus{outline:none !important}');
	});

	it('should attach a keydown eventListener', () => {
		keydown.initEvent('keydown', false, true);
		document.dispatchEvent(keydown);
		expect(document.getElementsByTagName('STYLE')[0].innerHTML).toEqual('');
	});
});

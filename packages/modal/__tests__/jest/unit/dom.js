import * as DOM from '../../../src/lib/dom';

describe(`Modal > DOM > findDialog`, () => {
	
    it('should return a node with an aria-role of dialog', async () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
			<div class="modal__inner" role="dialog" aria-labelledby="modal-label">
				<h1 id="modal-label">Modal</h1>
				<button>Focusable element</button>
				<input type="text">
				<input type="text">
				<svg role="button" aria-label="close" tabindex="0" class="modal__close-btn js-modal-toggle" fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
					<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</div>
		</div>`;
        expect(DOM.findDialog(document.querySelector('#modal-1'))).toEqual(document.querySelector('.modal__inner'));
    });

    it('should return a node with an aria-role of alertdialog', async () => {
        document.body.innerHTML = `<div id="modal" class="js-modal modal" data-modal-toggle="js-modal-toggle">
            <div class="modal__inner" role="alertdialog" aria-labelledby="modal-label">
                <h1 id="modal-label">Modal</h1>
            </div>
        </div>`;
        expect(DOM.findDialog(document.querySelector('#modal'))).toEqual(document.querySelector('.modal__inner'));
    });

    it('should return undefined if it cant find a dialog or alertdialog', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle"></div>`;
        expect(DOM.findDialog(document.querySelector('#modal-1'))).toEqual(undefined);
        expect(warn).toHaveBeenCalledWith('No dialog or alertdialog found in modal node');
        warn.mockRestore();
    });

});

describe(`Modal > DOM > findToggles`, () => {

    it('should return an array of nodes to toggle (open and close) the modal', async () => {
        document.body.innerHTML = `<button class="js-modal-toggle"></button>
			<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle"></div>`;
		
        expect(DOM.findToggles(document.querySelector('#modal-1'), { toggleSelectorAttribute: 'data-modal-toggle' })).toEqual([document.querySelector('.js-modal-toggle')]);
    });

    it('should return an empty array if it cant find any buttons', async () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle"></div>`;
        expect(DOM.findToggles(document.querySelector('#modal-1'), { toggleSelectorAttribute: 'data-modal-toggle' })).toEqual([]);
    });
});

describe(`Modal > DOM > getFocusableChildren`, () => {

    it('should return an array of focusable nodes ', async () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle">
			<button class="btn"></button>
			<input class="input" />		
		</div>`;
		
        expect(DOM.getFocusableChildren(document.querySelector('#modal-1'))).toEqual([document.querySelector('.btn'), document.querySelector('.input')]);
    });

    it('should return an empty array if it cant find any focusable nodes', async () => {
        document.body.innerHTML = `<div id="modal-1" class="js-modal modal" data-modal-toggle="js-modal-toggle"></div>`;
        expect(DOM.getFocusableChildren(document.querySelector('#modal-1'))).toEqual([]);
    });
});



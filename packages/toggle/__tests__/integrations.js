import toggle from '../src';

let Toggles, TogglesLocal;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<a tabindex="0" id="btn-1-1" href="#target-1" class="js-toggle_btn">Test toggle</a>
        <a href="#target-1" class="js-toggle_btn">Test toggle</a>
        <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn">
            <div id="focusable-1-1" tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content, last node</div>
        </div>
        
        <a href="#target-2" class="js-toggle_btn-2">Test toggle</a>
        <div id="target-2" class="js-toggle" data-toggle="js-toggle_btn-2" data-delay="100"></div>
        
        <a href="#target-4" class="js-toggle__btn-4">Test toggle</a>
        <div id="target-4" class="js-toggle-local" data-toggle="js-toggle__btn-4"></div>
    </div>`;

    Toggles = toggle('.js-toggle', {
        trapTab: true,
        closeOnBlur: true,
        closeOnClick: true,
        focus: true
    });
    TogglesLocal = toggle('.js-toggle-local', {
        local: true
    });
};

describe(`Toggle > Initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 2', async () => {
        expect(Toggles.length).toEqual(2);
    });

    it('should return the expected API', () => {
        expect(Toggles[0]).not.toBeNull();
        expect(Toggles[0].node).not.toBeNull();
        expect(Toggles[0].startToggle).not.toBeNull();
        expect(Toggles[0].toggle).not.toBeNull();
        expect(Toggles[0].getState).not.toBeNull();
    });

    it('should create instance with different options based on node data-attributes from same init function', () => {
        expect(Toggles[0].getState().settings.delay).not.toEqual(Toggles[1].getState().settings.delay);
        expect(Toggles[1].getState().settings.delay).toEqual('100');
    });

});

describe('Toggle > API', () => {

    it('should expose a toggle function that toggles the state of the instance', async () => {
        expect(Toggles[0].getState().isOpen).toEqual(false);
        Toggles[0].toggle();
        expect(Toggles[0].getState().isOpen).toEqual(true);
        Toggles[0].toggle();
    });
    
});

describe('Toggle > Localised toggle', () => {

    it('should toggle a localised area of DOM', async () => {
        TogglesLocal[0].toggle();
        expect(TogglesLocal[0].node.parentNode.classList.contains(TogglesLocal[0].getState().statusClass)).toEqual(true);
        TogglesLocal[0].toggle();
        expect(TogglesLocal[0].node.parentNode.classList.contains(TogglesLocal[0].getState().statusClass)).toEqual(false);
    });
    
});

describe('Toggle > Global toggle', () => {

    it('should toggle at the document level', async () => {
        Toggles[0].toggle();
        expect(document.documentElement.classList.contains(Toggles[0].getState().statusClass)).toEqual(true);
        Toggles[0].toggle();
        expect(document.documentElement.classList.contains(Toggles[0].getState().statusClass)).toEqual(false);
    });
    
});

describe('Toggle > Multiple toggle buttons', () => {

    it('should change attributes of all toggle buttons when an instance changes state', async () => {
        const togglesExpanded = toggles => toggles.reduce((acc, curr) => {
            if (curr.getAttribute('aria-expanded') === 'false') acc = false;
            return acc;
        }, true);

        Toggles[0].toggle();
        expect(togglesExpanded(Toggles[0].getState().toggles)).toEqual(true);
        Toggles[0].toggle();
        expect(togglesExpanded(Toggles[0].getState().toggles)).toEqual(false);
    });

});

// focusin event not bubbling to document
describe('Toggle > Close on blur', () => {
    it('should close an open toggle when the document.activeElement becomes a non-child element', async () => {
        Toggles[0].toggle();
        // TogglesLocal[0].getState().toggles[0].focus();
        const focusin = new CustomEvent('focusin', { bubbles: true, cancelable: false });
        document.dispatchEvent(focusin);
        expect(Toggles[0].getState().isOpen).toEqual(false);
    });

});

describe('Toggle > Close on click', () => {
    it('should close an open toggle when the a non-child is clicked', async () => {
        Toggles[0].toggle();
        TogglesLocal[0].getState().toggles[0].click();
        expect(Toggles[0].getState().isOpen).toEqual(false);
    });

});

describe('Toggle > Tabbing', () => {

    it('should tab to the last focusable child with a shift-tab', async () => {
        const shiftTab = new window.KeyboardEvent('keydown', { keyCode: 9, bubbles: true, shiftKey: true });
        const focusableChildren = Toggles[0].getState().focusableChildren;
        Toggles[0].toggle();
        focusableChildren[0].dispatchEvent(shiftTab);
        expect(document.activeElement).toEqual(focusableChildren[focusableChildren.length -1]);
    });

    it('should trapTab and return to the first focusable child', async () => {
        const tab = new window.KeyboardEvent('keydown', { keyCode: 9, bubbles: true });
        const focusableChildren = Toggles[0].getState().focusableChildren;
        focusableChildren[0].dispatchEvent(tab);
        expect(document.activeElement).toEqual(focusableChildren[0]);

        //and close for next test
        Toggles[0].toggle();
    });

});

describe('Toggle > Escape to close', () => {

    it('should close open toggles when the escape key is pressed', async () => {
        const escape = new window.KeyboardEvent('keydown', { keyCode: 27, bubbles: true });
        Toggles[0].toggle();
        document.dispatchEvent(escape);
        expect(Toggles[0].getState().isOpen).toEqual(true);
    });
});
import toggle from '../src';

let Toggles;
// let TogglesLocal;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<a tabindex="0" id="btn-1-1" href="#target-1" class="js-toggle_btn">Test toggle</a>
        <a href="#target-1" class="js-toggle_btn">Test toggle</a>
        <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn"><div id="focusable-1-1" tabindex="0">Test focusable content</div><div tabindex="0">Test focusable content</div><div tabindex="0">Test focusable content</div></div>
        
        <a href="#target-2" class="js-toggle_btn-2">Test toggle</a>
        <div id="target-2" class="js-toggle" data-toggle="js-toggle_btn-2" data-delay="100"></div>
        
        <a href="#target-4" class="js-toggle__btn-4">Test toggle</a>
        <div id="target-4" class="js-toggle-local" data-toggle="js-toggle__btn-4"></div>
    </div>`;

    Toggles = toggle('.js-toggle', {
        trapTab: true,
        closeOnBlur: true,
        focus: true
    });
    // TogglesLocal = toggle('.js-toggle-local', {
    //     local: true
    // });
};

describe(`Toggle > Accessibility`, () => {
    
    beforeAll(init);
    
    it('should add aria attributes to toggle buttons', async () => {
        expect(Toggles[0].getState().toggles[0].getAttribute('aria-controls')).toEqual(Toggles[0].node.getAttribute('id'));
        expect(Toggles[0].getState().toggles[0].getAttribute('aria-expanded')).toEqual('false');
    });


    it('should focus on the first focusable child node fo the target when toggled open', () => {
        Toggles[0].getState().toggles[0].click();
        Toggles[0].getState().toggles[0].click();
        expect(document.activeElement.getAttribute('id')).toEqual('focusable-1-1');
    });

});
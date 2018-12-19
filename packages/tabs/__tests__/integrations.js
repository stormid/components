import Tabs from '../src';

let TabSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="js-tabs tabs">
    <nav class="tabs__nav">
        <a id="tab-1" class="tabs__nav-link js-tabs__link" href="#panel-1">Tab 1</a>
        <a id="tab-2" class="tabs__nav-link js-tabs__link" href="#panel-2">Tab 2</a>
        <a id="tab-3" class="tabs__nav-link js-tabs__link" href="#panel-3">Tab 3</a>
    </nav>
    <section id="panel-1" class="tabs__section">Panel 1</section>
    <section id="panel-2" class="tabs__section" hidden>
            <p>Panel 2</p>
            <p><a href="/">Test link</a></p>
            <p><a href="/">Test link</a></p>
    </section>
    <section id="panel-3" class="tabs__section" hidden>
        <p>Panel 3</p>
        <p><a href="/">Test link</a></p>
        <p><a href="/">Test link</a></p>
    </section>
</div>`;

    TabSet = Tabs.init('.js-tabs');
    // TabSetTwo = Tabs.init('.js-tabs', { });
};

describe(`Initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
      expect(TabSet.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(TabSet[0]).not.toBeNull();
        expect(TabSet[0].node).not.toBeNull();
        expect(TabSet[0].getState).not.toBeNull();
    });

    // it('should create instance with different options based on node data-attributes from same init function', () => {
        // expect(Toggles[0].getState().settings.delay).not.toEqual(Toggles[1].getState().settings.delay);
        // expect(Toggles[1].getState().settings.delay).toEqual('100');
    // });

});
    
describe(`Accessibility`, () => {

    it('should add correct attributes to tabs', async () => {
        expect(TabSet[0].getState().tabs[1].getAttribute('role')).toEqual('tab');
        expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('false');
        expect(TabSet[0].getState().tabs[1].getAttribute('tabindex')).toEqual('-1');
    });

    it('should add correct attributes to panels', async () => {
        expect(TabSet[0].getState().panels[1].getAttribute('aria-labelledby')).toEqual(TabSet[0].getState().tabs[1].getAttribute('id'));
        expect(TabSet[0].getState().panels[1].getAttribute('role')).toEqual('tabpanel');
        expect(TabSet[0].getState().panels[1].getAttribute('hidden')).toEqual('hidden');
        expect(TabSet[0].getState().panels[1].getAttribute('tabindex')).toEqual('-1');
    });

    it('should add keyboard event listener for the enter key to each toggle button', () => {
        const right = new window.KeyboardEvent('keydown', { keyCode: 39, bubbles: true });

        TabSet[0].getState().tabs[0].dispatchEvent(right);
        expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');

        // Toggles[0].getState().toggles[0].dispatchEvent(enter);
        // expect(Toggles[0].getState().toggles[0].getAttribute('aria-expanded')).toEqual('false');
    });
    
});
import tabs from '../src';

let TabSet;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div role="tablist">
        <nav class="tabs__nav">
            <a id="tab-1" class="tabs__nav-link js-tabs__link" href="#panel-1" role="tab">Tab 1</a>
            <a id="tab-2" class="tabs__nav-link js-tabs__link" href="#panel-2" role="tab">Tab 2</a>
            <a id="tab-3" class="tabs__nav-link js-tabs__link" href="#panel-3" role="tab">Tab 3</a>
        </nav>
        <section id="panel-1" class="tabs__section" role="tabpanel">Panel 1</section>
        <section id="panel-2" class="tabs__section" role="tabpanel" hidden>
                <p>Panel 2</p>
                <p><a href="/">Test link</a></p>
                <p><a href="/">Test link</a></p>
        </section>
        <section id="panel-3" class="tabs__section" role="tabpanel" hidden>
            <p>Panel 3</p>
            <p><a href="/">Test link</a></p>
            <p><a href="/">Test link</a></p>
        </section>
    </div>
    <div role="tablist" data-active-index="1">
        <nav class="tabs__nav">
            <a id="tab-4" class="tabs__nav-link js-tabs__link" href="#panel-4" role="tab">Tab 4</a>
            <a id="tab-5" class="tabs__nav-link js-tabs__link" href="#panel-5" role="tab">Tab 5</a>
            <a id="tab-6" class="tabs__nav-link js-tabs__link" href="#panel-6" role="tab">Tab 6</a>
        </nav>
        <section id="panel-4" class="tabs__section" role="tabpanel">Panel 4</section>
        <section id="panel-5" class="tabs__section" role="tabpanel" hidden>
                <p>Panel 5</p>
                <p><a href="/">Test link</a></p>
                <p><a href="/">Test link</a></p>
        </section>
        <section id="panel-6" class="tabs__section" role="tabpanel" hidden>
            <p>Panel 6</p>
            <p><a href="/">Test link</a></p>
            <p><a href="/">Test link</a></p>
        </section>
    </div>`;

    TabSet = tabs('[role=tablist]');
};

describe(`Tabs > Initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
        expect(TabSet.length).toEqual(2);
    });

    it('should return the expected API', () => {
        expect(TabSet[0]).not.toBeNull();
        expect(TabSet[0].node).not.toBeNull();
        expect(TabSet[0].getState).not.toBeNull();
    });

    it('should create instance with different options based on node data-attributes from same init function', () => {
        expect(TabSet[0].getState().settings.activeIndex).not.toEqual(TabSet[1].getState().settings.activeIndex);
        expect(TabSet[1].getState().settings.activeIndex).toEqual('1');
    });

});
    
describe(`Tabs > Accessibility > ARIA`, () => {

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
    
});

describe(`Tabs > Accessibility > keyboard events`, () => {
    it('should add keyboard event listener for the left and right keys to each tab', () => {
        const right = new window.KeyboardEvent('keydown', { keyCode: 39, bubbles: true });
        const left = new window.KeyboardEvent('keydown', { keyCode: 37, bubbles: true });

        TabSet[0].getState().tabs[0].dispatchEvent(right);
        expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');
        TabSet[0].getState().tabs[1].dispatchEvent(left);
        expect(TabSet[0].getState().tabs[0].getAttribute('aria-selected')).toEqual('true');
    });
    
    it('should add keyboard event listener for the space key to each tab', () => {
        const space = new window.KeyboardEvent('keydown', { keyCode: 32, bubbles: true });

        TabSet[0].getState().tabs[1].dispatchEvent(space);
        expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');
        
    });

    it('should add keyboard event listener for the enter key to each tab', () => {
        const enter = new window.KeyboardEvent('keydown', { keyCode: 13, bubbles: true });

        TabSet[0].getState().tabs[2].dispatchEvent(enter);
        expect(TabSet[0].getState().tabs[2].getAttribute('aria-selected')).toEqual('true');
        
    });

    it('should add keyboard event listener for the down key to each tab', () => {
        const down = new window.KeyboardEvent('keydown', { keyCode: 40, bubbles: true });

        TabSet[0].getState().tabs[2].dispatchEvent(down);
        expect(document.activeElement).toEqual(TabSet[0].getState().panels[2]);
        
    });

    it('should ignore other keyboard events, tab should follow tab order of the page', () => {
        const tab = new window.KeyboardEvent('keydown', { keyCode: 9, bubbles: true });
        const space = new window.KeyboardEvent('keydown', { keyCode: 32, bubbles: true });

        TabSet[0].getState().tabs[1].dispatchEvent(space);
        TabSet[0].getState().tabs[1].dispatchEvent(tab);
        expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');
        
    });

});

describe(`Tabs > mouse events`, () => {
    it('should click event listener for each tab', () => {
        const click = new MouseEvent('click', { bubbles: true, cancelable: true });

        TabSet[0].getState().tabs[2].dispatchEvent(click);
        expect(TabSet[0].getState().tabs[2].getAttribute('aria-selected')).toEqual('true');
    });
});
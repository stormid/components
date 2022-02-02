import tabs from '../../src';
import { getSelection } from '../../src';

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
    </div>`;

    TabSet = tabs('[role=tablist]');
    
};


describe(`Tabs > init`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
        expect(TabSet.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(TabSet[0]).not.toBeNull();
        expect(TabSet[0].node).not.toBeNull();
    });

    it('should return without throwing if no DOM nodes are found', () => {
        expect(tabs('.js-no-found')).toBeUndefined();
    });

    it('should set activeIndex based on options passed to init', () => {
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
        </div>`;

        TabSet = tabs('[role=tablist]', { activeIndex: '2' });

        expect(TabSet[0].getState().activeIndex).toEqual(2);
    });

    it('should set activeIndex based on data attribute', () => {
        document.body.innerHTML = `<div role="tablist" data-active-index="1">
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
        </div>`;

        TabSet = tabs('[role=tablist]');

        expect(TabSet[0].getState().activeIndex).toEqual(1);
    });

    it('should set activeIndex based on location hash', () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost',
            hash: '#panel-3'
        };

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
        </div>`;

        TabSet = tabs('[role=tablist]');

        expect(TabSet[0].getState().activeIndex).toEqual(2);
    });


});

describe('Validate > Initialisation > Get Selection', () => {

    const setupDOM = () => {
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
        </div>`;
    }

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const tabs = document.querySelector('[role="tablist"]');
        const els = getSelection(tabs);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const tabs = document.querySelectorAll('[role="tablist"]');
        const els = getSelection(tabs);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const tabs = document.querySelector('[role="tablist"]');
        const els = getSelection([tabs]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('[role="tablist"]');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});

import Tabs from '../../src';

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
    
};


describe(`Init`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
      expect(TabSet.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(TabSet[0]).not.toBeNull();
        expect(TabSet[0].node).not.toBeNull();
    });

});

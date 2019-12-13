import { getActiveIndexByHash } from '../../src/lib/utils';

const init = () => {
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
};

describe(`Tabs > utils > getActiveIndexByHash`, () => {
    beforeAll(init);
    
    it('should return the index of a tab with an id matching the hash', async () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost',
            hash: '#panel-2'
        };
        const panels = [].slice.call(document.querySelectorAll('.tabs__section'));
        expect(getActiveIndexByHash(panels)).toEqual(1);
    });

    it('should return undefined if no hash is present on window location', async () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost'
        };
        const panels = [].slice.call(document.querySelectorAll('.js-tabs__link'));
        expect(getActiveIndexByHash(panels)).toEqual(undefined);
    });

    it('should return undefined if hash does not match id of any tabs', async () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost',
            hash: '#not-found'
        };
        const panels = [].slice.call(document.querySelectorAll('.js-tabs__link'));
        expect(getActiveIndexByHash(panels)).toEqual(undefined);
    });

});

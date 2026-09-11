import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { getActiveIndexByHash, getActiveIndexOnLoad, clampIndex, coerceSettings, BOOLEAN_SETTINGS, NUMBER_SETTINGS } from '../../src/lib/utils.js';

const init = () => {
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
};

describe(`Tabs > utils > getActiveIndexByHash`, () => {
    before(init);

    it('should return the index of a tab with an id matching the hash', async () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost',
            hash: '#panel-2'
        };
        global.location = global.window.location;
        const panels = [].slice.call(document.querySelectorAll('.tabs__section'));
        assert.deepStrictEqual(getActiveIndexByHash(panels), 1);
    });

    it('should return undefined if no hash is present on window location', async () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost'
        };
        global.location = global.window.location;
        const panels = [].slice.call(document.querySelectorAll('.js-tabs__link'));
        assert.deepStrictEqual(getActiveIndexByHash(panels), undefined);
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
        global.location = global.window.location;
        const panels = [].slice.call(document.querySelectorAll('.js-tabs__link'));
        assert.deepStrictEqual(getActiveIndexByHash(panels), undefined);
    });

});

const initWithAttribute = () => {
    document.body.innerHTML = `<div role="tablist" data-active-index="2">
        <nav class="tabs__nav">
            <a id="tab-1" class="tabs__nav-link js-tabs__link" href="#panel-1" role="tab">Tab 1</a>
            <a id="tab-2" class="tabs__nav-link js-tabs__link " href="#panel-2" role="tab">Tab 2</a>
            <a id="tab-3" class="tabs__nav-link js-tabs__link" href="#panel-3" role="tab">Tab 3</a>
        </nav>
        <section id="panel-1" class="tabs__section" role="tabpanel">Panel 1</section>
        <section id="panel-2" class="tabs__section" role="tabpanel">
                <p>Panel 2</p>
                <p><a href="/">Test link</a></p>
                <p><a href="/">Test link</a></p>
        </section>
        <section id="panel-3" class="tabs__section" role="tabpanel">
            <p>Panel 3</p>
            <p><a href="/">Test link</a></p>
            <p><a href="/">Test link</a></p>
        </section>
    </div>`;
};


describe(`Tabs > utils > getActiveIndexOnLoad`, () => {
    before(initWithAttribute);

    it('should use the data attribute if no hash is available', async () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost',
            hash: ''
        };
        global.location = global.window.location;
        const node = document.querySelector('[role="tablist"]');
        const panels = [].slice.call(document.querySelectorAll('[role=tabpanel]'));
        assert.deepStrictEqual(getActiveIndexOnLoad(panels, node), 2);
    });

    it('should return undefined if neither hash or attribute', async () => {
        const node = document.querySelector('[role="tablist"]');
        node.removeAttribute('data-active-index');
        const panels = [].slice.call(document.querySelectorAll('[role=tabpanel]'));
        assert.deepStrictEqual(getActiveIndexOnLoad(panels, node), undefined);
    });

    it('should use the hash as priority if available', async () => {
        const node = document.querySelector('[role="tablist"]');
        node.setAttribute('data-active-index', "1");

        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost',
            hash: '#panel-3'
        };
        global.location = global.window.location;

        const panels = [].slice.call(document.querySelectorAll('[role=tabpanel]'));
        assert.deepStrictEqual(getActiveIndexOnLoad(panels, node), 2);
    });

    it('should fall back to the data attribute when the hash matches no panel', async () => {
        const node = document.querySelector('[role="tablist"]');
        node.setAttribute('data-active-index', "2");

        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            port: '123',
            protocol: 'http:',
            hostname: 'localhost',
            hash: '#does-not-exist'
        };
        global.location = global.window.location;

        const panels = [].slice.call(document.querySelectorAll('[role=tabpanel]'));
        assert.deepStrictEqual(getActiveIndexOnLoad(panels, node), 2);
    });

});

describe(`Tabs > utils > clampIndex`, () => {

    it('should return the index unchanged when it is a valid in-range integer', () => {
        assert.strictEqual(clampIndex(2, 3), 2);
        assert.strictEqual(clampIndex(0, 3), 0);
    });

    it('should default to 0 when the index is out of range', () => {
        assert.strictEqual(clampIndex(99, 3), 0);
        assert.strictEqual(clampIndex(-1, 3), 0);
    });

    it('should default to 0 when the index is NaN or not an integer', () => {
        assert.strictEqual(clampIndex(NaN, 3), 0);
        assert.strictEqual(clampIndex(1.5, 3), 0);
    });

});

describe(`Tabs > utils > coerceSettings`, () => {

    const opts = { booleans: BOOLEAN_SETTINGS, numbers: NUMBER_SETTINGS };

    it('should coerce the string forms of Boolean settings', () => {
        const result = coerceSettings({ updateUrl: 'false', focusOnLoad: 'true' }, opts);
        assert.strictEqual(result.updateUrl, false);
        assert.strictEqual(result.focusOnLoad, true);
    });

    it('should leave Boolean settings passed as Booleans untouched', () => {
        const result = coerceSettings({ updateUrl: true, focusOnLoad: false }, opts);
        assert.strictEqual(result.updateUrl, true);
        assert.strictEqual(result.focusOnLoad, false);
    });

    it('should coerce numeric settings to Numbers', () => {
        assert.strictEqual(coerceSettings({ activeIndex: '2' }, opts).activeIndex, 2);
    });

    it('should leave settings that are neither Boolean nor Number untouched', () => {
        assert.strictEqual(coerceSettings({ activation: 'manual' }, opts).activation, 'manual');
    });

});

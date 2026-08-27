# Tabs

Accessible tabbed panelled content areas

---

## Usage

Create a tablist in HTML
```
<div class="tabs js-tabs">
    <div class="tabs__tabslist" role="tablist">
        <a id="tab-1" class="tabs__tab js-tabs__link" href="#panel-1" role="tab">Tab 1</a>
        <a id="tab-2" class="tabs__tab js-tabs__link" href="#panel-2" role="tab">Tab 2</a>
        <a id="tab-3" class="tabs__tab js-tabs__link" href="#panel-3" role="tab">Tab 3</a>
    </div>
    <div id="panel-1" class="tabs__tabpanel" role="tabpanel">Panel 1</div>
    <div id="panel-2" class="tabs__tabpanel" role="tabpanel" hidden>Panel 2</div>
    <div id="panel-3" class="tabs__tabpanel" role="tabpanel" hidden>Panel 3</div>
</div>
```

Install the package
```
npm i -S @stormid/tabs
```

Import the module
```
import tabs from '@stormid/tabs';
```

Initialise the module via selector string
```
const [ instance ] = tabs('.js-tabs');
```

Initialise with a DOM element
```
const element = document.querySelector('.js-tabs');
const [ instance ] = tabs(element);
```

Initialise with a Node list
```
const elements = document.querySelectorAll('.js-tabs');
const [ instance ] = tabs(elements);
```

Initialise with an Array of elements
```
const elements = [].slice.call(document.querySelectorAll('.js-tabs'));
const [ instance ] = tabs(elements);
```

Tabs may be either anchors (`href="#panel-id"`) or buttons (`aria-controls="panel-id"`).

## Options
```
{
    tabSelector: '[role=tab]', // selector for a tab link
    activeClass: 'is--active', //className added to active tab
    updateUrl: true, //replace the location hash with the active tab's fragment identifier
    activation: 'auto', //'auto' or 'manual' describes tab activation method
    activeIndex: 0, //index of initially active tab
    focusOnLoad: false, //a boolean to set whether the page should focus on the active tab after loading
    onChange: null //Function called with { activeIndex, tab, panel } whenever a tab is activated (not on initial load)
}
```

Options may also be set via `data-*` attributes on the tabs node, e.g. `data-activation="manual"`, `data-update-url="false"`, `data-active-index="1"`. Boolean options accept the strings `"true"`/`"false"`. `onChange` is a function and can only be set via JS options.

## Keyboard

Tabs follow the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): `Left`/`Right` move between tabs, `Home`/`End` jump to the first/last tab, and `Enter`/`Space` activate a tab. In `auto` activation navigating also activates; in `manual` activation navigation only moves focus until `Enter`/`Space` is pressed.

## Setting the active tab
```
On page load the active tab will be set by (in order of precedence):
1. The page hash. If the page hash in the address bar matches the ID of a panel, it will be activated on page load
2. The data-active-index attribute. If the tabs node found to have a <pre>data-active-index</pre> attribute, that tab will be activated on page load. This is a zero-based index.   
3. The tab specified by the activeIndex in the settings. This is a zero-based index.
4. The first tab in the set.

## API

Initialisation returns an array of instances. Each instance exposes the interface
```
{
    getState, //a Function that returns the current state Object
    goTo,     //a Function (index) => void that programmatically activates the tab at index
    destroy   //a Function that removes all event listeners added by the instance
}
```

## Tests
```
npm t
```

## License
MIT
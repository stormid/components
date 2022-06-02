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

## Options
```
{
    tabSelector: '[role=tab]', // selector for a tab link  
    activeClass: 'is--active', //className added to active tab
    updateURL: true, //push tab fragment identifier to window location hash
    activeIndex: 0 //index of initially active tab
    focusOnLoad: true //a boolean to set whether the page should focus on the first tab after loading
}
```

## API

tabs() returns an array of instances. Each instance exposes the interface
```
{
    getState, a Function that returns the current state Object
}
```

## Tests
```
npm t
```

## License
MIT
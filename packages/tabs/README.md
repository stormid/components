# Tabs

Accessible tabbed panelled content areas

---

## Usage
HTML
```
<div class="js-tabs tabs">
    <nav class="tabs__nav">
        <a id="tab-1" class="tabs__nav-link js-tabs__link" href="#panel-1">Tab 1</a>
        <a id="tab-2" class="tabs__nav-link js-tabs__link" href="#panel-2">Tab 2</a>
        <a id="tab-3" class="tabs__nav-link js-tabs__link" href="#panel-3">Tab 3</a>
    </nav>
    <section id="panel-1" class="tabs__section">Panel 1</section>
    <section id="panel-2" class="tabs__section">Panel 2</section>
    <section id="panel-3" class="tabs__section">Panel 3</section>
</div>
```

JS
```
npm i @stormid/tabs
```
```
import Tabs from '@stormid/tabs';

Tabs.init('.js-tabs');
```

## Options
```
{
    tabSelector: '.js-tabs__link', // selector for a tab link  
    activeClass: 'is--active', //className added to active tab
    updateURL: true, //push tab fragment identifier to window location 
    activeIndex: 0 //index of initially active tab
}
```

## API
Each instance returned from init exposes the interface
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
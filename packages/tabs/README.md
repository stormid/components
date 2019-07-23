# Tabs

Accessible tabs for multi-panelled content areas.

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
npm i -S @stormid/tabs
```
either using es6 import
```
import Tabs from '@stormid/tabs';

Tabs.init('.js-tabs');
```
aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from '@stormid/load;

Load('/content/js/async/tabs.standalone.js')
    .then(() => {
        Tabs.init('.js-tabs');
    });
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

e.g.
```
Tabs.init('.js-tabs', { updateURL: false });
```

## Tests
```
npm t
```

## Browser support
This is module has both es6 and UMD distributions. It depends upon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT
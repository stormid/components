# Storm Check All

Checkbox group state management.

Check and uncheck a group of checkboxes, update the toggle button/input label, and dispatch a change event on each checkbox.

## Usages
HTML
=======
```
<label for="check-all">Check all</label>
<input class="js-check__all" type="checkbox" id="check-all" data-group="group-1">

<label>
    <input data-group-name="group-1" name="..." id="..." value="1">
</label>
<label>
    <input data-group-name="group-1" name="..." id="..." value="2">
</label>
```

JS
either using es6 import
```
import CheckAll from '@stormid/check-all';

CheckAll.init('.js-check__all');
```
aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/check-all.standalone.js')
    .then(() => {
        CheckAll.init('.js-check__all');
    });
```

Options
```
{
    defaultLabel: 'Check all' //this should match the label in the DOM
    activeLabel: 'Uncheck all',
}
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends upon Object.assign so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfils for Array functions and eventListeners.

## Dependencies
None

## License
MIT

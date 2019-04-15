# Storm Validate
[![npm version](https://badge.fury.io/js/@storm/validate.svg)](https://badge.fury.io/js/@storm/validate)

Light, depenendency-free client-side form validation library to support .NET MVC (core) unobtrusive validation (using data-val attributes) and HTML5 attribute-based constraint validation.

## Usage
HTML
```
<form action="./">
    <!-- Any form with inputs containing HTML validation attributes -->
	<input type="text" name="field-1" id="field-1" required>
	<input type="email" name="field-2" id="field-2" required>
	<input type="text" name="field-3" id="field-3" pattern="\d*" required>
    
    <!-- or .NET MVC-generated data-val attributes -->
    <input type="text" data-val="true" data-val-required="The Required String field is required." name="field-4" id="field-4" />
	<!-- The server-rendered span is recycled by the library to render errors -->
    <span style="color: red" class="field-validation-valid" data-valmsg-for="field-4" data-valmsg-replace="true" />
    <input type="submit">
</div>
```
JS
```
npm i -S @storm/validate
```
```
import Validate from '@storm/validate';

let validator = Validate.init('form');

```
## API

1. addMethod - to add a custom validation method:
```
var validator = Validate.init('.my-form');

validator.addMethod(
    'MyFieldName', //input/input group name
    (value, fields, params) => { //validation method
        return value === 'test'; //must return boolean
    },
    'Value must equal "test"' //error message on validation failure
);
```

2. validate - to manually trigger validation on the whole form:
```
var validator = Validate.init('.my-form');

validator.validate();
```

## Tests
```
npm t
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends upon Object.assign, Promises and element.classList so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT

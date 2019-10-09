# Validate

Client-side form validation library to support .NET MVC (core) unobtrusive validation using data-val attributes and HTML5 attribute-based constraint validation.

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
const validators = Validate.init('.my-form');

validators[0].addMethod(
    'MyFieldName', //input/input group name
    (value, fields, params) => { //validation method
        return value === 'test'; //must return boolean
    },
    'Value must equal "test"' //error message on validation failure
);
```

2. validate - to manually trigger validation on the whole form:
```
const validators = Validate.init('.my-form');

validators[0].validate();
```

3. addGroup - add an input or input validation group
```
const validators = Validate.init('.my-form');
const fieldsArray = Array.from(document.querySelector('.new-fields'))

//add by passing an array of fields
//if these fields span multiple groups they will be collected into the correct validation groups internally by the validator
validators[0].addGroup(fieldsArray);
```

4. removeGroup - remove a validation group
```
const validators = Validate.init('.my-form');
const fieldsArray = Array.from(document.querySelectorAll([name=new-fields]))

//add by passing an array of fields
validators[0].addGroup(fieldsArray);

//remove by passing the name of a group
validators[0].removeGroup('new-fields');
```


## Tests
```
npm t
```

## Browser support
This is module has both es6 and UMD distributions. It depends upon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie8+ is supported with polyfills.

## Dependencies
None

## License
MIT

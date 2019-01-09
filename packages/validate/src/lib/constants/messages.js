export default {
    required() { return 'This field is required.'; } ,
    email() { return 'Please enter a valid email address.'; },
    pattern() { return 'The value must match the pattern.'; },
    url(){ return 'Please enter a valid URL.'; },
    date() { return 'Please enter a valid date.'; },
    dateISO() { return 'Please enter a valid date (ISO).'; },
    number() { return 'Please enter a valid number.'; },
    digits() { return 'Please enter only digits.'; },
    maxlength(props) { return `Please enter no more than ${props} characters.`; },
    minlength(props) { return `Please enter at least ${props} characters.`; },
    max(props){ return `Please enter a value less than or equal to ${[props]}.`; },
    min(props){ return `Please enter a value greater than or equal to ${props}.`},
    equalTo() { return 'Please enter the same value again.'; },
    remote() { return 'Please fix this field.'; }
};
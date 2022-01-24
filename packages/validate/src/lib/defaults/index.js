export default {
    messages: {
        required() { return 'This field is required'; } ,
        email() { return '{{value}} is not a valid email address'; },
        pattern() { return '{{value}} does not match the pattern'; },
        url(){ return '{{value}} is not valid URL'; },
        number() { return '{{value}} is not a valid number'; },
        maxlength(props) { return `Enter no more than ${props.max} characters`; },
        minlength(props) { return `Enter at least ${props.min} characters`; },
        max(props){ return `Enter a value less than or equal to ${props.max}`; },
        min(props){ return `Enter a value greater than or equal to ${props.min}`;}
    }
};
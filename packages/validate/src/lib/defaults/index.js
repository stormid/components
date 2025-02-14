export default {
    messages: {
        required() { return 'You must answer this question.'; } ,
        email() { return 'Enter a valid email address, for example: example@example.com.'; },
        pattern() { return 'The value must match the pattern'; },
        url(){ return 'Enter a valid URL'; },
        number() { return 'Enter a valid number'; },
        maxlength(props) { return `Enter no more than ${props.max} characters`; },
        minlength(props) { return `Enter at least ${props.min} characters`; },
        max(props){ return `Enter a number lower than or equal to ${props.max}`; },
        min(props){ return `Enter a number higher than or equal to ${props.min}`;}
    }
};
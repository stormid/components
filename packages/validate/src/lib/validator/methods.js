import {
    EMAIL_REGEX,
    URL_REGEX,
    DATE_ISO_REGEX,
    NUMBER_REGEX,
    DIGITS_REGEX
} from '../constants/index.js';
import {
    fetch,
    isRequired,
    extractValueFromGroup,
    resolveGetParams
} from './utils.js';

const isOptional = group => !isRequired(group) && extractValueFromGroup(group) === '';

const extractValidationParams = (group, type) => group.validators.filter(validator => validator.type === type)[0].params;

//A group is valid only when every field in it satisfies the constraint, so results are
//AND-ed across fields (seeded true). A prior overwrite-per-field meant only the last field
//in a multi-field group was actually checked.
const regexMethod = regex => group => isOptional(group) || group.fields.reduce((acc, input) => acc && regex.test(input.value), true);

const paramMethod = (type, reducer) => group => isOptional(group) || group.fields.reduce(reducer(extractValidationParams(group, type)), true);

const shouldValidateByParam = param => param !== undefined;

export default {
    required: group => extractValueFromGroup(group) !== '',
    email: regexMethod(EMAIL_REGEX),
    url: regexMethod(URL_REGEX),
    dateISO: regexMethod(DATE_ISO_REGEX),
    number: regexMethod(NUMBER_REGEX),
    digits: regexMethod(DIGITS_REGEX),
    minlength: paramMethod(
        'minlength',
        params => (acc, input) => acc && +input.value.length >= +params.min
    ),
    maxlength: paramMethod(
        'maxlength',
        params => (acc, input) => acc && +input.value.length <= +params.max
    ),
    equalto: paramMethod('equalto', params => (acc, input) => acc && params.other.reduce((subgroupAcc, subgroup) =>
        subgroupAcc && extractValueFromGroup(subgroup) === input.value, true)),
    //HTML5 pattern matches against the whole value (implicitly anchored per the HTML spec),
    //unlike the unanchored .NET regex adaptor below. The non-capturing group keeps alternations
    //(e.g. "cat|dog") anchored as a whole rather than becoming "^cat" | "dog$".
    pattern: paramMethod('pattern', params => {
        //accept a string (the pattern attribute) or a RegExp, preserving any flags
        const source = params.regex instanceof RegExp ? params.regex.source : params.regex;
        const flags = params.regex instanceof RegExp ? params.regex.flags : undefined;
        const regex = RegExp(`^(?:${source})$`, flags);
        return (acc, input) => acc && regex.test(input.value);
    }),
    regex: paramMethod('regex', params => (acc, input) => acc && RegExp(params.pattern).test(input.value)),
    min: paramMethod('min', params => (acc, input) => acc && !isNaN(parseInt(input.value, 10)) && +input.value >= +params.min),
    max: paramMethod('max', params => (acc, input) => acc && !isNaN(parseInt(input.value, 10)) && +input.value <= +params.max),
    stringlength: paramMethod('stringlength', params => (acc, input) => acc && +input.value.length <= +params.max),
    length: paramMethod('length', params => (acc, input) => acc && +input.value.length >= +params.min && (params.max === undefined || +input.value.length <= +params.max)),
    range: paramMethod('range', params => (acc, input) => acc && (!shouldValidateByParam(params.min) || +input.value >= +params.min) && (!shouldValidateByParam(params.max) || +input.value <= +params.max)),
    remote: (group, params) => new Promise((resolve, reject) => {
        const value = extractValueFromGroup(group);
        const isGet = params.type === 'get';
        //form-encode the field being validated plus any additional fields, matching the
        //application/x-www-form-urlencoded Content-Type (and .NET [Remote] model binding).
        const additional = params.additionalfields ? resolveGetParams(params.additionalfields) : '';
        const primary = `${encodeURIComponent(group.fields[0].name)}=${encodeURIComponent(value)}`;
        const body = additional ? `${primary}&${additional}` : primary;

        fetch(isGet ? `${params.url}?${body}` : params.url, {
            method: params.type && params.type.toUpperCase() || 'POST',
            body: isGet ? undefined : body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            //the group's real-time controller (if any) lets destroy()/removeGroup() abort this request
            signal: group.controller && group.controller.signal
        })
            //propagate failures so validation can settle (fail-closed) rather than hang forever
            .then(resolve)
            .catch(reject);
    }),
    custom: (method, group) => isOptional(group) || method(extractValueFromGroup(group), group.fields)
};
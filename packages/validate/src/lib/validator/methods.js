import {
    EMAIL_REGEX,
    URL_REGEX,
    DATE_ISO_REGEX,
    NUMBER_REGEX,
    DIGITS_REGEX
} from '../constants';
import { 
    fetch,
    isRequired,
    extractValueFromGroup,
    resolveGetParams
} from './utils';

const isOptional = group => !isRequired(group) && extractValueFromGroup(group) === '';

const extractValidationParams = (group, type) => group.validators.filter(validator => validator.type === type)[0].params;

const regexMethod = regex => group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = regex.test(input.value), acc), false);

const paramMethod = (type, reducer) => group => isOptional(group) || group.fields.reduce(reducer(extractValidationParams(group, type)), false);

export default {
    required: group => extractValueFromGroup(group) !== '',
    email: regexMethod(EMAIL_REGEX),
    url: regexMethod(URL_REGEX),
    date: group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = !/Invalid|NaN/.test(new Date(input.value).toString()), acc), false),
    dateISO: regexMethod(DATE_ISO_REGEX),
    number: regexMethod(NUMBER_REGEX),
    digits: regexMethod(DIGITS_REGEX),
    minlength: paramMethod(
        'minlength',
        params => (acc, input) => (acc = Array.isArray(input.value) ? input.value.length >= +params.min : +input.value.length >= +params.min, acc)
    ),
    maxlength: paramMethod(
        'maxlength',
        params => (acc, input) => (acc = Array.isArray(input.value) ? input.value.length <= +params.max : +input.value.length <= +params.max, acc)
    ),
    equalto: paramMethod('equalto', params => (acc, input) => {
        return acc = params.other.reduce((subgroupAcc, subgroup) => {
            if(extractValueFromGroup(subgroup) !== input.value) subgroupAcc = false;
            return subgroupAcc;
        }, true), acc;
    }),
    pattern: paramMethod('pattern', params => (acc, input) => (acc = RegExp(params.regex).test(input.value), acc)),
    regex: paramMethod('regex', params => (acc, input) => (acc = RegExp(params.regex).test(input.value), acc)),
    min: paramMethod('min', params => (acc, input) => (acc = +input.value >= +params.min, acc)),
    max: paramMethod('max', params => (acc, input) => (acc = +input.value <= +params.max, acc)),
    length: paramMethod('length', params => (acc, input) => (acc = (+input.value.length >= +params.min && (params.max === undefined || +input.value.length <= +params.max)), acc)),
    range: paramMethod('range', params => (acc, input) => (acc = (+input.value >= +params.min && +input.value <= +params.max), acc)),
    remote: (group, params) => new Promise((resolve, reject) => {
        fetch((params.type !== 'get' ? params.url : `${params.url}?${resolveGetParams(params.additionalfields)}`), {
            method: params.type.toUpperCase(),
            body: params.type === 'get' ? null : resolveGetParams(params.additionalfields),
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            })
        })
        .then(res => res.json())
        .then(data => { resolve(data); })
        .catch(res => { resolve(`Server error: ${res}`); });
    }),
    custom: (method, group) => isOptional(group)|| method(extractValueFromGroup(group), group.fields)
};
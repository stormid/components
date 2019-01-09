import { EMAIL_REGEX, URL_REGEX, DATE_ISO_REGEX, NUMBER_REGEX, DIGITS_REGEX } from '../constants';
import { fetch, isRequired, extractValueFromGroup, resolveGetParams } from './utils';

const isOptional = group => !isRequired(group) && extractValueFromGroup(group) === '';

const extractValidationParams = (group, type) => group.validators.filter(validator => validator.type === type)[0].params;

const curryRegexMethod = regex => group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = regex.test(input.value), acc), false);

const curryParamMethod = (type, reducer) => group => isOptional(group) || group.fields.reduce(reducer(extractValidationParams(group, type)), false);

export default {
    required: group => extractValueFromGroup(group) !== '',
    email: curryRegexMethod(EMAIL_REGEX),
    url: curryRegexMethod(URL_REGEX),
    date: group => isOptional(group)|| group.fields.reduce((acc, input) => (acc = !/Invalid|NaN/.test(new Date(input.value).toString()), acc), false),
    dateISO: curryRegexMethod(DATE_ISO_REGEX),
    number: curryRegexMethod(NUMBER_REGEX),
    digits: curryRegexMethod(DIGITS_REGEX),
    minlength: curryParamMethod(
        'minlength',
        params => (acc, input) => (acc = Array.isArray(input.value) ? input.value.length >= +params.min : +input.value.length >= +params.min, acc)
    ),
    maxlength: curryParamMethod(
        'maxlength',
        params => (acc, input) => (acc = Array.isArray(input.value) ? input.value.length <= +params.max : +input.value.length <= +params.max, acc)
    ),
    equalto: curryParamMethod('equalto', params => (acc, input) => {
        return acc = params.other.reduce((subgroupAcc, subgroup) => {
            if(extractValueFromGroup(subgroup) !== input.value) subgroupAcc = false;
            return subgroupAcc;
        }, true), acc;
    }),
    pattern: curryParamMethod('pattern', params => (acc, input) => (acc = RegExp(params.regex).test(input.value), acc)),
    regex: curryParamMethod('regex', params => (acc, input) => (acc = RegExp(params.regex).test(input.value), acc)),
    min: curryParamMethod('min', params => (acc, input) => (acc = +input.value >= +params.min, acc)),
    max: curryParamMethod('max', params => (acc, input) => (acc = +input.value <= +params.max, acc)),
    length: curryParamMethod('length', params => (acc, input) => (acc = (+input.value.length >= +params.min && (params.max === undefined || +input.value.length <= +params.max)), acc)),
    range: curryParamMethod('range', params => (acc, input) => (acc = (+input.value >= +params.min && +input.value <= +params.max), acc)),
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
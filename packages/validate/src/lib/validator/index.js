import methods from './methods.js';
import {
    isCheckable,
    isSelect,
    isFile,
    isHidden,
    domNodesFromCommaList,
    groupIsDisabled,
    findErrors,
    groupIsAllHidden,
    isMessage
} from './utils.js';
import {
    DOTNET_ADAPTORS,
    DOTNET_PARAMS,
    DOTNET_ERROR_SPAN_DATA_ATTRIBUTE,
    DOM_SELECTOR_PARAMS,
    GROUP_ATTRIBUTE,
    FALLBACK_ERROR_MESSAGE
} from '../constants/index.js';

/**
 * Resolve validation parameter to a string or array of DOM nodes
 * 
 * @param param [String] identifier for the data-attribute `data-val-${param}`
 * @param input [DOM node] the node which contains the data-val- attribute
 * 
 * @return validation param [Object] indexed by second part of param name (e.g., 'min' part of length-min') and array of DOM nodes or a string
 */
export const resolveParam = (param, input) => {
    let value = input.getAttribute(`data-val-${param}`);
    return ({
        [param.split('-')[1]]: ~DOM_SELECTOR_PARAMS.indexOf(param) ? domNodesFromCommaList(value, input): value
    });
};

/**
 * Looks up the data-val property against the known .NET MVC adaptors/validation method
 * runs the matches against the node to find param values, and returns an Object containing all  parameters for that adaptor/validation method
 * 
 * @param input [DOM node] the node on which to look for matching adaptors
 * @param adaptor [String] .NET MVC data-attribute that identifies validator
 * 
 * @return validation params [Object] Validation param object containing all validation parameters for an adaptor/validation method
 */
export const extractParams = (input, adaptor) => DOTNET_PARAMS[adaptor]
    ? {
        params: DOTNET_PARAMS[adaptor]
            .reduce((acc, param) => input.hasAttribute(`data-val-${param}`) ? Object.assign(acc, resolveParam(param, input)) : acc, {})
    }
    : false;

/**
 * Returns the error message of a data-val- validator attribute. An empty message is an authoring error:
 * the validator is kept (so e.g. a required field stays required) with a generic message rather than a blank one
 * 
 * @param input [DOM node]
 * @param adaptor [String] .NET MVC data-attribute that identifies validator
 * 
 * @return message [String]
 */
const resolveMessage = (input, adaptor) => {
    const message = input.getAttribute(`data-val-${adaptor}`);
    if (isMessage(message)) return message;
    console.warn(`Empty data-val-${adaptor} error message on field '${input.getAttribute('name')}', using '${FALLBACK_ERROR_MESSAGE}'.`);
    return FALLBACK_ERROR_MESSAGE;
};

/**
 * Reducer that takes all known .NET MVC adaptors (data-attributes that specify a validation method that should be applied to the node)
 * and checks against a DOM node for matches, returning an array of validators
 * 
 * @param input [DOM node]
 * 
 * @return validators [Array], each validator compposed of 
 *                              type [String] naming the validator and matching it to validation method function
 *                              message [String] the error message displayed if the validation method returns false
 *                              params [Object] (optional) 
 */
export const extractDataValValidators = input => DOTNET_ADAPTORS.reduce((validators, adaptor) =>
    !input.hasAttribute(`data-val-${adaptor}`)
        ? validators
        : [...validators,
            Object.assign({
                type: adaptor,
                message: resolveMessage(input, adaptor) },
            extractParams(input, adaptor)
            )
        ],
[]);

/**
 * Takes an input and returns the array of validators described by its .NET MVC data-val- attributes.
 * Fields without data-val="true" have no validators; native constraint attributes (required, pattern, etc.) are not read.
 * 
 * @param input [DOM node]
 * 
 * @return validators [Array]
 */
export const normaliseValidators = input => input.getAttribute('data-val') === 'true'
    ? extractDataValValidators(input)
    : [];

/**
 * Calls a validation method against an input group
 * 
 * @param group [Array] DOM nodes with the same name attribute
 * @param validator [String] The type of validator matching it to validation method function
 * 
 * @returns  validityState [Promise]
 * 
 */
export const validate = (group, validator) => new Promise((resolve, reject) => {
    try {
        validator.type === 'custom'
            ? resolve(methods.custom(validator.method, group))
            : resolve(methods[validator.type](group, validator.params));
    } catch (err) {
        console.warn(err);
        resolve(err);
    }
});

/**
 * Reducer constructing an validation Object for a group of DOM nodes
 *  
 * @param input [DOM node]
 * 
 * @returns validation object [Object] consisting of
 *                            valid [Boolean] the validityState of the group
 *                            validators [Array] of validator objects
 *                            fields [Array] DOM nodes in the group
 *                            serverErrorNode [DOM node] .NET MVC server-rendered error message span
 * 
 */
export const assembleValidationGroup = (acc, input) => {
    let name = (input.getAttribute('data-val-'+GROUP_ATTRIBUTE)) ? input.getAttribute('data-val-'+GROUP_ATTRIBUTE) : input.getAttribute('name') ;
    if (!name) return console.warn('Missing data group or name attribute'), acc;

    if (acc[name] && isHidden(input)) return acc;

    const serverErrorNode = document.querySelector(`[${DOTNET_ERROR_SPAN_DATA_ATTRIBUTE}="${name}"]`) || false;

    return acc[name] = acc[name] ? Object.assign(acc[name], { fields: [...acc[name].fields, input] })
        : {
            valid: false,
            validators: normaliseValidators(input),
            fields: [input],
            serverErrorNode
        }, acc;
};

/**
 * Returns a reducer that reduces the resolved response from an array of validation Promises performed against a group
 * into an array of error messages or an empty array.
 * A message returned by the validation method (e.g. from a remote API) is used if it is a non-empty string, otherwise the validator's message
 * 
 * @return error messages [Array]
 * 
 */
export const reduceErrorMessages = (group, state) => (acc, validity, j) => validity === true
    ? acc
    : [...acc, isMessage(validity) ? validity : state.groups[group].validators[j].message];

/**
 * From all groups found in the current form, thosethat do not require validation (have no assocated validators) are removed
 * 
 * @param groups [Object] name-indexed object consisting of all groups found in the current form
 * 
 * @return groups [Object] name-indexed object consisting of all validatable groups
 * 
 */
export const removeUnvalidatableGroups = groups => {
    let validationGroups = {};

    for (let group in groups){
        if (groups[group].validators.length > 0 && !groupIsAllHidden(groups[group].fields)){
            validationGroups[group] = groups[group];
        }
    }
    return validationGroups;
};

/**
 * Takes a form DOM node and returns the initial form validation state - an object consisting of all the validatable input groups
 * with validityState, fields, validators, and associated data required to perform validation and render errors.
 * 
 * @param form [DOM nodes] 
 * 
 * @return state [Object] consisting of groups [Object] name-indexed validation groups
 * 
 */
export const getInitialState = (form, settings) => {
    const groups = removeUnvalidatableGroups(Array.from(form.querySelectorAll('input:not([type=submit]), textarea, select'))
        .reduce(assembleValidationGroup, {}));
    return {
        form,
        settings,
        errors: findErrors(groups),
        realTimeValidation: false,
        groups
    };
};

/**
 * Reducer run against an array of resolved validation promises to set the overall validityState of a group
 * 
 * @return validityState [Boolean] 
 * 
 */
export const reduceGroupValidityState = (acc, curr) => {
    if (curr !== true) acc = false;
    return acc;
};


export const isFormValid = validityState => [].concat(...validityState).reduce(reduceGroupValidityState, true);

/**
 * Aggregates validation promises for all groups into a single promise
 * 
 * @params groups [Object]
 * 
 * @return validation results [Promise] aggregated promise
 * 
 */
export const getValidityState = groups => Promise.all(
    Object.keys(groups)
        .map(group => getGroupValidityState(groups[group]))
);

/**
 * Aggregates all of the validation promises for a single group into a single promise
 * 
 * @params groups [Object]
 * 
 * @return validation results [Promises] aggregated promise
 * 
 */
export const getGroupValidityState = group => {
    //check if group is disabled
    if (groupIsDisabled(group.fields)) return Promise.resolve([true]);
    return Promise.all(group.validators.map(validator => new Promise((resolve) => {
        validate(group, validator)
            .then(res => {
                if (String(res) !== 'true') resolve(String(res) === 'false' ? false : res);
                else resolve(true);
            })
            //a rejected validator (e.g. a remote request that errored) must still settle,
            //otherwise Promise.all never resolves and validation hangs. Fail closed: treat
            //the field as invalid so its error message is shown. An AbortError is teardown,
            //not a failure, so don't log it (the render is guarded by the caller either way).
            .catch(err => {
                if (!(err && err.name === 'AbortError')) console.warn(err);
                resolve(false);
            });
    })));
};

/**
 * Determines the event type to be used for real-time validation a given field based on field type
 * 
 * @params input [DOM node]
 * 
 * @return event type [String]
 * 
 */
export const resolveRealTimeValidationEvent = input => ['input', 'change'][Number(isCheckable(input) || isSelect(input) || isFile(input))];
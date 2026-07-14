/* node:coverage disable */
/*
 * Default settings used by an Autocomplete instance unless overridden by
 * options passed to init or by data-* attributes on the node.
 */
export default {
    minlength: 2,
    multiple: false,
    async: false,
    noResultsMsg: 'No results found',
    loadingMsg: 'Loading…',
    //announced when the query is too short to search; receives minlength so the
    //message can name it. A plain string is also accepted (see resolveMsg).
    queryTooShortMsg(minlength) {
        return `Type ${minlength} or more characters for results`;
    },
    inputClassname: 'autocomplete__input',
    //optional placeholder text for the combobox input
    placeholder: '',
    confirmOnBlur: true,
    //single mode: submit typed text when nothing is selected (vs strict picker)
    allowFreeText: false,
    list: false,
    values: [],
    template(option) {
        return option.value;
    },
    //renders each option in the list; falls back to template when not set. May
    //return a string (shown as text) or a DOM node for richer markup (e.g. a
    //second detail line) than the display label — see renderOptions.
    optionTemplate: false,
    extractValue(option) {
        return option.value;
    }
};
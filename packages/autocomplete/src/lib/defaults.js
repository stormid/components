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
    extractValue(option) {
        return option.value;
    }
};
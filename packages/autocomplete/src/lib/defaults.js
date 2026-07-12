/* node:coverage disable */
/*
 * Default settings used by an Autocomplete instance unless overridden by
 * options passed to init or by data-* attributes on the node.
 */
export default {
    minlength: 3,
    multiple: false,
    async: false,
    noResultsMsg: 'No results found',
    loadingMsg: 'Loading…',
    inputClassname: 'autocomplete__input',
    confirmOnBlur: true,
    list: false,
    values: [],
    template(option) {
        return option.value;
    },
    extractValue(option) {
        return option.value;
    }
};
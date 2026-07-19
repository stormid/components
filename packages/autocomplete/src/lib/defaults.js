/* node:coverage disable */

export default {
    minlength: 2,
    maxResults: 6,
    multiple: false,
    async: false,
    noResultsMsg: 'No results found',
    loadingMsg: 'Loading…',
    hintMsg(minlength) {
        return `Type ${minlength} or more characters for results`;
    },
    inputClassName: 'autocomplete__input',
    placeholder: '',
    confirmOnBlur: true,
    allowFreeText: false,
    list: false,
    values: [],
    displayTemplate(option) {
        return option.value;
    },
    optionTemplate: false,
    submissionTemplate(option) {
        return option.value;
    }
};
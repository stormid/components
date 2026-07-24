/* node:coverage disable */

export default {
    name: null,
    search: null,
    values: [],
    list: false,
    minlength: 2,
    maxResults: 6,
    multiple: false,
    async: false,
    value: null,
    label: null,
    displayTemplate(option) {
        return option.value;
    },
    optionTemplate: false,
    submissionTemplate(option) {
        return option.value;
    },
    allowFreeText: false,
    submitOnConfirm: false,
    confirmOnBlur: true,
    clearOnBlur: false,
    placeholder: '',
    inputClassName: 'autocomplete__input',
    id: null,
    noResultsMsg: 'No results found',
    loadingMsg: 'Loading…',
    hintMsg(minlength) {
        return `Type ${minlength} or more characters for results`;
    }
};

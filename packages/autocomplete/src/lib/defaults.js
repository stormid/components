/* node:coverage disable */

export default {
    name: null,
    search: null,
    values: [],
    minlength: 2,
    maxResults: 6,
    multiple: false,
    async: false,
    debounceDelay: 200,
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
    spellcheck: false,
    //written onto the generated input only when set; null leaves the attribute off
    //(and leaves an enhanced server-rendered input's own attribute untouched)
    inputmode: null,
    autocorrect: null,
    autocapitalize: null,
    inputClassName: 'autocomplete__input',
    id: null,
    noResultsMsg: 'No results found',
    loadingMsg: 'Loading…',
    hintMsg(minlength) {
        return `Type ${minlength} or more characters for results`;
    },
    resultsMsg(count) {
        return `${count} ${count === 1 ? 'result is' : 'results are'} available`;
    },
    removeMsg(label) {
        return `Remove ${label}`;
    },
    selectionMsg(labels) {
        return labels.length ? `${labels.join(', ')} selected` : '';
    },
    selectionAddedMsg(label) {
        return `${label} added`;
    },
    selectionRemovedMsg(label) {
        return `${label} removed`;
    }
};

/* istanbul ignore file */
/*
 * Default settings used by a Modal instance if not otherwise overwritten with config
 *
 * @property 
 */
export default {
    minlength: 3,
    multiple: false,
    noResultsMsg: 'No results found',
    inputClassname: 'autocomplete__input',
    clearOnBlur: true,
    template(option) {
        return option.value;
    },
    extractValue(option) {
        return option.value;
    }
};
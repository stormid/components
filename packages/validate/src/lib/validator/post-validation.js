import { isSubmitButton, hasNameValue, hasFormactionValue } from './utils.js';
import {
    createButtonValueNode,
    cleanupButtonValueNode
}  from '../dom/index.js';
import { PREHOOK_DELAY } from '../constants/index.js';

export const postValidation = (event, resolve, store) => {
    const { settings, form } = store.getState();
    let buttonValueNode = false;
    let cachedAction = false;
    const submit = () => {
        if (settings.submit) settings.submit();
        else form.submit();

        buttonValueNode && cleanupButtonValueNode(buttonValueNode);
        cachedAction && form.setAttribute('action', cachedAction);
    };

    const formSubmitButtons = Array.from(form.querySelectorAll('[type="submit"]'));
    formSubmitButtons.forEach(formSubmitButton => {
        if (hasNameValue(formSubmitButton)) {
            buttonValueNode = createButtonValueNode(formSubmitButton, form);
        }
        if (hasFormactionValue(formSubmitButton)) {
            cachedAction = form.getAttribute('action');
            form.setAttribute('action', formSubmitButton.getAttribute('formaction'));
        }
    });

    if (event && event.target) {
        if (settings.preSubmitHook) {
            settings.preSubmitHook();
            window.setTimeout(submit, PREHOOK_DELAY);
        } else submit();
    }
    
    return resolve(true);
};
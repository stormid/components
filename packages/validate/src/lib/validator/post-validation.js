import { isSubmitButton, hasNameValue, hasFormactionValue } from './utils';
import {
    createButtonValueNode,
    cleanupButtonValueNode
}  from '../dom';
import { PREHOOK_DELAY } from '../constants';

export const postValidation = (event, res, Store) => {
    let buttonValueNode = false;
    let cachedAction = false;
    const submit = () => {
        if(Store.getState().settings.submit) Store.getState().settings.submit();
        else Store.getState().form.submit();
    };
    if(isSubmitButton(document.activeElement) && hasNameValue(document.activeElement)) {
        buttonValueNode = createButtonValueNode(document.activeElement, Store.getState().form);
    }
    if(isSubmitButton(document.activeElement) && hasFormactionValue(document.activeElement)) {
        cachedAction = Store.getState().form.getAttribute('action');
        Store.getState().form.setAttribute('action', document.activeElement.getAttribute('formaction'));
    }
    if(event && event.target) {
        if(Store.getState().settings.preSubmitHook) {
            Store.getState().settings.preSubmitHook();
            window.setTimeout(submit, PREHOOK_DELAY);
        } else submit();
    }               
    buttonValueNode && cleanupButtonValueNode(buttonValueNode);
    cachedAction && Store.getState().form.setAttribute('action', cachedAction);
    return res(true);
};
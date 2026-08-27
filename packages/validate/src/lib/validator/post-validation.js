import { hasNameValue, hasFormactionValue } from './utils.js';
import {
    createButtonValueNode,
    cleanupButtonValueNode
}  from '../dom/index.js';
import { PREHOOK_DELAY } from '../constants/index.js';

export const postValidation = (event, resolve, store) => {
    const { settings, form } = store.getState();

    /*
     * The submit-button handling below mutates the DOM (adds a hidden field to
     * carry a named button's value through a programmatic submit, and can rewrite
     * form.action for a formaction button). Those mutations are only cleaned up
     * inside submit(), so they must not run when validate() is invoked via the API
     * (no event) - otherwise every call leaks a hidden input and a formaction
     * button permanently rewrites form.action. Confine the whole thing to the
     * real submit-event path.
     */
    if (event && event.target) {
        let buttonValueNode = false;
        //track whether we overrode the action separately from its value, so an original
        //action of "" or an absent attribute is still restored correctly after submit.
        let actionOverridden = false;
        let cachedAction = null;
        const submit = () => {
            if (settings.submit) settings.submit();
            else form.submit();

            buttonValueNode && cleanupButtonValueNode(buttonValueNode);
            if (actionOverridden) {
                if (cachedAction === null) form.removeAttribute('action');
                else form.setAttribute('action', cachedAction);
            }
        };

        Array.from(form.querySelectorAll('[type="submit"]')).forEach(formSubmitButton => {
            if (hasNameValue(formSubmitButton)) {
                buttonValueNode = createButtonValueNode(formSubmitButton, form);
            }
            if (hasFormactionValue(formSubmitButton)) {
                if (!actionOverridden) cachedAction = form.getAttribute('action');
                actionOverridden = true;
                form.setAttribute('action', formSubmitButton.getAttribute('formaction'));
            }
        });

        if (settings.preSubmitHook) {
            settings.preSubmitHook();
            window.setTimeout(submit, PREHOOK_DELAY);
        } else submit();
    }

    return resolve(true);
};
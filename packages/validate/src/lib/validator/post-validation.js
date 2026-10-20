import { applySubmitter }  from '../dom/index.js';
import { PREHOOK_DELAY } from '../constants/index.js';

/**
 * Submits the form via settings.submit or natively, with the submit button that submitted it
 * mirrored onto the form for the duration (see applySubmitter).
 *
 * Mirroring, submitting and restoring all happen synchronously: form.submit() (and new FormData(form)
 * in a custom submit function) read the form at the time of the call, and overlapping submissions
 * can't interleave and leave one another's overrides behind
 *
 * @param store [Object]
 * @param submitter [Node] The submit button (event.submitter), if any
 *
 */
export const submitForm = (store, submitter) => {
    const { settings, form } = store.getState();
    const restore = submitter ? applySubmitter(form, submitter) : () => {};

    try {
        if (settings.submit) settings.submit(submitter);
        //called via the prototype as a control named "submit" shadows form.submit
        else HTMLFormElement.prototype.submit.call(form);
    } finally {
        restore();
    }
};

const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));

/**
 * Called once the form is valid. If called as a submit eventListener, calls the preSubmitHook (if any)
 * then submits the form. Anything these throw propagates, so validate() rejects
 *
 * @param event [Event] The submit event, undefined if validate() is invoked via the API
 * @param store [Object]
 *
 * @returns [Boolean|Promise] true, once the form has been submitted
 *
 */
export const postValidation = (event, store) => {
    const { settings } = store.getState();

    //only submit on the real submit-event path, not when validate() is invoked via the API (no event)
    if (!event || !event.target) return true;

    const submit = () => {
        submitForm(store, event.submitter);
        return true;
    };
    if (!settings.preSubmitHook) return submit();

    settings.preSubmitHook(event.submitter);
    return wait(PREHOOK_DELAY).then(submit);
};

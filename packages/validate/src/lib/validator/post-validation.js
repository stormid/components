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

export const postValidation = (event, resolve, store) => {
    const { settings } = store.getState();

    //only submit on the real submit-event path, not when validate() is invoked via the API (no event)
    if (event && event.target) {
        const submit = () => submitForm(store, event.submitter);

        if (settings.preSubmitHook) {
            settings.preSubmitHook();
            window.setTimeout(submit, PREHOOK_DELAY);
        } else submit();
    }

    return resolve(true);
};

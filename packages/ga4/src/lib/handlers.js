import { GA4_EVENTS, PARAMS, FILE_EXTENSIONS } from './constants';
import { queue, track } from './shared';
import { getScrollPercentage, findLink, getUrlParts, getSubmitButtonText } from './utils';

export const scroll = state => () => {
    const percentage = getScrollPercentage();
    if (percentage < 90) return;
    queue(state, {
        name: GA4_EVENTS.SCROLL,
        params: [
            [`${PARAMS.EVENT_PARAM_NUMBER}.percent_scrolled`, 90 ],
            [ PARAMS.ENGAGEMENT_TIME, state.timer.get() ]
        ]
    });
    document.removeEventListener('scroll', state.handlers.scroll);
};

export const engagement = state => {
    state.timer.stop();
    track(state, { name: GA4_EVENTS.USER_ENGAGEMENT, params: [[ PARAMS.ENGAGEMENT_TIME, state.timer.get() ]] });
};

export const click = state => evt => {
    const link = findLink(evt.target);
    if (!link) return;

    const { isExternal, hostname, pathname } = getUrlParts(link);
    const downloadExtension = link.href.match(new RegExp(FILE_EXTENSIONS, 'g'));

    //is an internal link or not matching download regex
    if (!isExternal && !downloadExtension) return;

    const params = [
        [`${PARAMS.EVENT_PARAM}.link_domain`, hostname],
        [`${PARAMS.EVENT_PARAM}.link_id`, link.id],
        [`${PARAMS.EVENT_PARAM}.link_url`, link.href],
        [`${PARAMS.EVENT_PARAM}.link_classes`, link.className],
        [ PARAMS.ENGAGEMENT_TIME, state.timer.get() ]
    ];

    if (!downloadExtension) {
        return track(state, {
            name: GA4_EVENTS.CLICK,
            params: [ ...params, [`${PARAMS.EVENT_PARAM}.outbound`, true] ]
        });
    }

    track(state, {
        name: GA4_EVENTS.FILE_DOWNLOAD,
        params: [
            ...params,
            [`${PARAMS.EVENT_PARAM}.file_extension`, downloadExtension],
            [`${PARAMS.EVENT_PARAM}.file_name`, pathname],
            [`${PARAMS.EVENT_PARAM}.link_text`, (link.innerText || link.textContent || '').trim()]
        ]
    });

};

export const formStart = (state, form, idx) => () => {
    queue(state, {
        name: GA4_EVENTS.FORM_START,
        params: [
            [`${PARAMS.EVENT_PARAM}.form_id`, form.id ],
            [`${PARAMS.EVENT_PARAM}.form_name`, form.name ],
            [`${PARAMS.EVENT_PARAM}.form_destination`, new URL(form.getAttribute('action') || '', document.location.origin + document.location.pathname + document.location.search).href ],
            [ PARAMS.ENGAGEMENT_TIME, state.timer.get() ]
        ]
    });
    form.removeEventListener('change', state.handlers.forms[idx]);
    state.forms[idx].started = true;
};

export const formSubmit = (state, form, idx) => () => {
    if (!state.forms[idx].started) state.handlers.forms[idx]();
    track(state, {
        name: GA4_EVENTS.FORM_SUBMIT,
        params: [
            [`${PARAMS.EVENT_PARAM}.form_id`, form.id ],
            [`${PARAMS.EVENT_PARAM}.form_name`, form.name ],
            [`${PARAMS.EVENT_PARAM}.form_destination`, new URL(form.getAttribute('action') || '', document.location.origin + document.location.pathname + document.location.search).href ],
            [`${PARAMS.EVENT_PARAM}.form_submit_text`, getSubmitButtonText(form) ],
            [ PARAMS.ENGAGEMENT_TIME, state.timer.get() ]
        ]
    });
};
import { GA4_EVENTS, PARAMS } from './constants';
import { send, getScrollPercentage, findTarget, getUrlParts } from './shared';
import { track } from './factory';

export const scroll = state => () => {
    const percentage = getScrollPercentage();
    if (percentage < 90) return;
    track(state, {
        name: GA4_EVENTS.SCROLL,
        params: [
            { name: `${PARAMS.EVENT_PARAM_NUMBER}.percent_scrolled`, value: 90 },
            { name: PARAMS.ENGAGEMENT_TIME, value: state.timer.get() }
        ]
    });
    document.removeEventListener('scroll', state.handlers.scroll);
};

export const engagement = state => {
    state.timer.stop();
    send(state, { name: GA4_EVENTS.ENGAGEMENT_TIME, params: [ { name: PARAMS.ENGAGEMENT_TIME, value: state.timer.get() } ] });
};

export const click = state => evt => {
    const target = findTarget(evt.target);
    if (!target) return;
    const tagName = target.tagName.toLowerCase();
    const elementType = tagName === 'a' ? 'link' : tagName;









    
    const hrefAttr = target.getAttribute('href') || void 0;
    const fileUrl = target.getAttribute('download') || hrefAttr;

    const { isExternal, hostname, pathname } = getUrlParts(fileUrl);
    const isInternalLink = elementType === 'link' && !isExternal;
    const [fileExtension] = fileUrl?.match(new RegExp(files.join('|'), 'g')) || [];

    const elementParam = `${param.eventParam}.${elementType}`;

    if (!targetElement || (isInternalLink && !fileExtension)) {
        return;
    }

    let eventParams = [
        [`${elementParam}_id`, targetElement.id],
        [`${elementParam}_classes`, targetElement.className],
        [`${elementParam}_name`, targetElement?.getAttribute('name')?.trim()],
        [`${elementParam}_text`, targetElement.textContent?.trim()],
        [`${elementParam}_value`, targetElement?.getAttribute('value')?.trim()],
        [`${elementParam}_url`, hrefAttr],
        [`${elementParam}_domain`, hostname],
        [`${param.eventParam}.outbound`, `${isExternal}`],
        [param.enagementTime, getActiveTime()],
    ];

    if (fileExtension) {
        eventParams = eventParams.concat([
        [`${param.eventParam}.file_name`, pathname || fileUrl],
        [`${param.eventParam}.file_extension`, fileExtension],
        ]);
    }


    track({
        name: fileExtension ? GA4_EVENTS.FILE_DOWNLOAD : GA4_EVENTS.CLICK,
        params: []
    });
    //dl
    /*
    en: file_download
    ep.link_id: 
    ep.link_url: http://localhost:8080/test.txt
    ep.link_text: txt file
    ep.file_name: /test.txt
    ep.file_extension: txt
    _et: 5895
    */

    //external link
    /*
    en=click
    ep.link_id=
    ep.link_classes=
    ep.link_url=https%3A%2F%2Fgoogle.com%2F
    ep.link_domain=google.com
    ep.outbound=true
    _et=119
    */

};
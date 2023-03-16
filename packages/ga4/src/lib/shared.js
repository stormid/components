import { ENDPOINT, PARAMS } from './constants';
import { filterUnusedParams, debounce, getSessionState, generateId, getId, getUserAgentData } from './utils';

export const send = state => {
    if (!state.data.base.length) return;
    const url = `${ENDPOINT}?${new URLSearchParams(filterUnusedParams(state.data.base))}`;
    
    if (navigator.sendBeacon) navigator.sendBeacon(url, state.data.events || undefined);
    //to do xhr version for no sendBeacon support?
    //mutaaaate...
    state.data.base = [];
    state.data.events = '';
    state.firstEvent = false;
    state.hitCount = state.hitCount + 1;
    return state;
};

const debounceSend = debounce(send, 1000);

export const queue = async (state, event) => {
    state.data = await add(state, event);
    debounceSend(state);
};

export const track = async (state, event) => {
    state.data = await add(state, event);
    send(state);
};


export const composeEventData = event => {
    if (!event) return;
    if (!event.name) return void console.warn(`GA4: Missing event name`);

    /*
    * Google Analytics API expects a return/newline separated string of event data
    * e.g.
        en=page_view
        en=view_search_results&ep.search_term=test&_et=9
        en=scroll&epn.percent_scrolled=90&_et=324
    */

    return [`${PARAMS.EVENT_NAME}=${event.name}${event.params ? `&${event.params.map(param => `${param[0]}${param[1] ? `=${param[1]}` : ''}`).join('&')}` : ''}`];
};

export const composeBaseData = async state => {
    const { firstVisit, sessionStart, sessionCount } = getSessionState(state);
    const { tid, settings } = state;
    const { architecture, bitness, fullVersionList, mobile, model, platform, platformVersion, wow64 } = await getUserAgentData();

    return [
        [PARAMS.PROTOCOL_VERSION, '2'],
        [PARAMS.TRACKING_ID, tid],
        [PARAMS.PAGE_ID, generateId()],
        [PARAMS.LANGUAGE, (navigator.language || '').toLowerCase()],
        [PARAMS.CLIENT_ID, getId(PARAMS.CLIENT_ID)],
        [PARAMS.FIRST_VISIT, firstVisit],
        [PARAMS.HIT_COUNT, state.hitCount],
        [PARAMS.SESSION_ID, getId(PARAMS.SESSION_ID)],
        [PARAMS.SESSION_COUNT, sessionCount],
        [PARAMS.SESSION_ENGAGEMENT, '1'],
        [PARAMS.SESSION_START, sessionStart],
        [PARAMS.DEBUG, settings.debug && 1],
        [PARAMS.REFERRER, document.referrer],
        [PARAMS.LOCATION, document.location.origin + document.location.pathname + document.location.search],
        [PARAMS.TITLE, document.title],
        [PARAMS.SCREEN_RESOLUTION, `${screen.width}x${screen.height}`],
        [PARAMS.UA_ARCHITECTURE, architecture],
        [PARAMS.UA_BITNESS, bitness],
        [PARAMS.UA_FULL_VERSION_LIST, fullVersionList && fullVersionList.map(item => `${item.brand} ${item.version}`).join(' ')],
        [PARAMS.UA_MOBILE, mobile],
        [PARAMS.UA_MODEL, model],
        [PARAMS.UA_PLATFORM, platform],
        [PARAMS.UA_PLATFORM_VERSION, platformVersion],
        [PARAMS.UA_WOW64, wow64]
    ];
};


/*
 * return base data (if none exists already), and event data
 */
export const add = async (state, event) => {
    const baseData = state.data.base.length === 0 ? await composeBaseData(state) : state.data.base;
    return {
        base: baseData,
        events: [ state.data.events, composeEventData(event) ].join('\r\n')
    };
};
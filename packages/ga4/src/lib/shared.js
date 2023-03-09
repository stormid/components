import { ENDPOINT, PARAMS } from './constants';
import { filterUnusedParams, debounce, getSessionState, generateId, getId } from './utils';


export const send = state => {
    if (!state.data.base.length) return;
    const params = state.data.events.length === 1
        ? new URLSearchParams(filterUnusedParams([ ...state.data.base, ...state.data.events]))
        : new URLSearchParams(filterUnusedParams(state.data.base));
    const url = `${ENDPOINT}?${params}`;
    const data = state.data.events.length <= 1 ? undefined : new URLSearchParams(state.data.events);
    
    if (navigator.sendBeacon) navigator.sendBeacon(url, data);
    //to do xhr version for no sendBeacon support?

    //mutaaaate...
    state.data.base = [];
    state.data.events = [];
    state.firstEvent = false;
    state.hitCount = state.hitCount + 1;
};

const debounceSend = debounce(send, 1000);

export const queue = (state, event) => {
    state.data = add(state, event);
    debounceSend(state);
};

export const track = (state, event) => {
    state.data = add(state, event);
    send(state);
};


export const composeEventData = event => {
    let data = [];
    if (event) {
        if (!event.name) console.warn(`GA4: Missing event name`);
        else data.push([PARAMS.EVENT_NAME, event.name]);
        if (event.params) data = [ ...data, ...event.params ];
    }

    return data;
};

export const composeBaseData = state => {
    const { firstVisit, sessionStart, sessionCount } = getSessionState(state);
    const { tid, debug } = state;
    
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
        [PARAMS.DEBUG, debug],
        [PARAMS.REFERRER, document.referrer],
        [PARAMS.LOCATION, document.location.origin + document.location.pathname + document.location.search],
        [PARAMS.TITLE, document.title],
        [PARAMS.SCREEN_RESOLUTION, `${screen.width}x${screen.height}`]
    ];
};


/*
 * return base data (if none exists already), and event data
 */
export const add = (state, event) => ({
    base: state.data.base.length === 0 ? composeBaseData(state) : state.data.base,
    events: [ ...state.data.events, ...composeEventData(event)]
});
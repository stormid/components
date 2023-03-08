import { ENDPOINT, PARAMS, SEARCH_QUERY_PARAMS } from './constants';

export const hasSearchParams = str => SEARCH_QUERY_PARAMS.some(si => str.includes(`&${si}=`) || str.includes(`?${si}=`));

export const filterUnusedParams = params => params.filter(([, value]) => value);

export const send = state => {
    if (!state.data.base.length) return;
    const params = state.data.events.length === 1
        ? new URLSearchParams(filterUnusedParams([ ...state.data.base, ...state.data.events]))
        : new URLSearchParams(filterUnusedParams(state.data.base));
    const url = `${ENDPOINT}?${params}`;
    const data = state.data.events.length <= 1 ? undefined : new URLSearchParams(state.data.events);
    
    if (navigator.sendBeacon) navigator.sendBeacon(url, data);
    //to do xhr version for no sendBeacon support

    //mutaaaate...
    state.data.base = [];
    state.data.events = [];
    state.firstEvent = false;
    state.hitCount = state.hitCount + 1;
};

/*
Event structure
{
    name: '',
    params: [
        {name: '', value: ''}
    ]
}
*/
export const composeEventData = event => {
    const data = [];
    if (event) {
        if (!event.name) console.warn(`GA4: Missing event name`);
        else data.push([PARAMS.EVENT_NAME, event.name]);
        if (event.params) event.params.forEach(param => data.push([param.name, param.value]));
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


export const getDocumentInfo = () => {
    const { hostname, origin, pathname, search } = document.location;
    const title = document.title;
    const referrer = document.referrer;
  
    return { location: origin + pathname + search, hostname, pathname, referrer, title };
};

export const generateId = (length = 16) => {
    const id = `${Math.floor(Math.random() * 1e16)}`;
    length = length > 16 ? 16 : length;
    return id.padStart(length, '0').substring(-1, length);
};

export const getId = (type, storage = localStorage) => {
    const stored = storage.getItem(type);
    if (stored) return stored;

    const newId = generateId();
    storage.setItem(type, newId);

    return newId;
};

export const getSessionState = state => {
    const firstVisit = !localStorage.getItem(PARAMS.CLIENT_ID) ? '1' : void 0;
    const sessionStart = !sessionStorage.getItem(PARAMS.SESSION_ID) ? '1' : void 0;
    const sessionCount = getSessionCount(state);
    
    return { firstVisit, sessionStart, sessionCount };
};

export const getSessionCount = state => {
    const count = +(sessionStorage.getItem(PARAMS.SESSION_COUNT) || 0) + 1;
    
    if (state.firstEvent) sessionStorage.setItem(PARAMS.SESSION_COUNT, count);

    return count;
};

export function debounce(callback, frequency = 300, timer = 0) {
    return (...args) => (clearTimeout(timer), (timer = setTimeout(callback, frequency, ...args)));
}


export const getScrollPercentage = () => {
    const body = document.body;
    const scrollTop = window.pageYOffset || body.scrollTop;
    const { scrollHeight, offsetHeight, clientHeight } = document.documentElement;
    const documentHeight = Math.max(
        body.scrollHeight,
        scrollHeight,
        body.offsetHeight,
        offsetHeight,
        body.clientHeight,
        clientHeight
    );
    const trackLength = documentHeight - window.innerHeight;
  
    return Math.floor(Math.abs(scrollTop / trackLength) * 100);
};

export const timer = () => {
    let value = 0;
    let startTime;
    let isRunning = false;
    const start = () => {
        if (isRunning) return;
        startTime = new Date(Date.now()).getTime();
        isRunning = true;
    };
    const stop = () => {
        if (!isRunning) return;
        value = get();
        isRunning = false;
    };
    const get = () => (value + (new Date(Date.now()).getTime() - startTime));

    return { start, stop, get };
};

export const findTarget = element => {
    let target = element;

    while (target) {
        if (target?.matches && target?.matches('a, button, input[type=submit], input[type=button]')) break;
        target = target?.parentNode;
    }

    return target;
};

export const getUrlParts = url => {
    let hostname, pathname;
    let isExternal = false;
  
    try {
        ({ hostname, pathname } = (url && new URL(url)) || {});
    } catch {
        // no-op
    }
  
    if (hostname) isExternal = hostname !== window.location.host;
  
    return { isExternal, hostname, pathname };
};
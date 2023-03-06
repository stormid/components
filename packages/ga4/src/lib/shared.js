import { PARAMS } from './constants';

export const send = url => {
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
        return;
    }
    const img = document.createElement('img');
    img.width = 1;
    img.height = 1;
    img.src = url;
    return img;
};

export const composeParams = (state, event) => {
    const { firstVisit, sessionStart, sessionCount } = getSessionState(state);
    const { tid, debug } = state;
    
    const params = [
        [PARAMS.PROTOCOL_VERSION, '2'],
        [PARAMS.TRACKING_ID, tid],
        [PARAMS.PAGE_ID, generateId()],
        [PARAMS.LANGUAGE, (navigator.language || '').toLowerCase()],
        [PARAMS.CLIENT_ID, getId(PARAMS.CLIENT_ID)],
        [PARAMS.FIRST_VISIT, firstVisit],
        [PARAMS.HIT_COUNT, '1'],
        [PARAMS.sessionId, getId(PARAMS.SESSION_ID)],
        // [PARAMS.sessionCount, sessionCount],
        // [PARAMS.sessionEngagement, '1'],
        // [PARAMS.sessionStart, sessionStart],
        [PARAMS.DEBUG, debug],
        // [PARAMS.referrer, referrer],
        // [PARAMS.location, location],
        // [PARAMS.title, title],
        // [PARAMS.screenResolution, `${screen.width}x${screen.height}`],
    ];

    //   params = params.concat(getEventMeta({ type, event }));
    //   params = params.filter(([, value]) => value);

    return new URLSearchParams(params);

};


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

export const getId = type => {
    const stored = localStorage.getItem(type);
    if (stored) return stored;

    const newId = generateId();
    localStorage.setItem(type, newId);

    return newId;
};

export const getSessionState = state => {
    const firstVisit = !localStorage.getItem(PARAMS.CLIENT_ID) ? '1' : void 0;
    const sessionStart = !sessionStorage.getItem(PARAMS.SESSION_ID) ? '1' : void 0;
    let sessionCount = getSessionCount();
    
    return { firstVisit, sessionStart, sessionCount };
};

export const getSessionCount = () => {
    const count = +(sessionStorage.getItem(PARAMS.SESSION_COUNT) || 0) + 1;
    sessionStorage.setItem(PARAMS.SESSION_COUNT, count);

    return count;
};
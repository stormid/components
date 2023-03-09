import { SEARCH_QUERY_PARAMS, PARAMS } from './constants';

export const hasSearchParams = str => SEARCH_QUERY_PARAMS.some(si => str.includes(`&${si}=`) || str.includes(`?${si}=`));

export const filterUnusedParams = params => params.filter(([, value]) => value);

export function debounce(callback, frequency = 300, timer = 0) {
    return (...args) => (clearTimeout(timer), (timer = setTimeout(callback, frequency, ...args)));
}

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

export const findLink = element => {
    let target = element;
    while (target && target.tagName) {
        if (target.tagName && target.tagName.toLowerCase() === 'a') return target;
        target = target.parentNode;
    }
    return false;
};

export const getUrlParts = url => {
    let hostname, pathname;
  
    try {
        ({ hostname, pathname } = (url && new URL(url)) || {});
    } catch {
        // no-op
    }
  
    return { isExternal: hostname !== window.location.host, hostname, pathname };
};

export const isSubmitButton = node =>  (node && node.getAttribute('type') === 'submit') || node.nodeName === 'BUTTON';

export const getSubmitButtonText = form => {
    const submitNode = isSubmitButton(document.activeElement) ? document.activeElement : form.querySelector(`button:not([type=button]), input[type=submit]`);
    if (!submitNode) return '';
    if (submitNode.nodeName === 'BUTTON') return (submitNode.innerText || submitNode.textContent).trim();
    return submitNode.value || 'Submit';
};
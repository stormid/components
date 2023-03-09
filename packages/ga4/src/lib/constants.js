export const PARAMS = {
    PROTOCOL_VERSION: 'v', // Measurement Protocol Version 2 for GA4
    TRACKING_ID: 'tid', // Measurement ID for GA4 or Stream ID
    PAGE_ID: '_p', // random number, hold in sessionStorage, unknown use
    LANGUAGE: 'ul', // User Language
    CLIENT_ID: 'cid', // client ID, hold in localStorage
    FIRST_VISIT: '_fv', // first_visit, identify returning users based on existance of client ID in localStorage
    HIT_COUNT: '_s', // session hits counter
    SESSION_ID: 'sid', // session ID random generated, hold in sessionStorage
    SESSION_COUNT: 'sct', // session count for a user, increase +1 in new interaction
    SESSION_ENGAGEMENT: 'seg', // session engaged (interacted for at least 10 seconds), assume yes
    SESSION_START: '_ss',
    DEBUG: '_dbg', //debug
    REFERRER: 'dr', // document referrer
    LOCATION: 'dl', // document location
    TITLE: 'dt', // document title
    EVENT_NAME: 'en', // event like page_view, view_search_results or scroll
    EVENT_PARAM: 'ep', // prefix for event parameter
    EVENT_PARAM_NUMBER: 'epn', // prefix fpr event parameter number, eg percent_scrolled
    SCREEN_RESOLUTION: 'sr', // Screen Resolution
    ENGAGEMENT_TIME: '_et', // engagement time
};

export const FILE_EXTENSIONS =  'pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma';

export const ENDPOINT = 'https://www.google-analytics.com/g/collect';

export const SEARCH_QUERY_PARAMS = ['q', 's', 'search', 'query', 'keyword'];

// export const CLICK_TARGETS = 'a, button, input[type=submit], input[type=button]';

export const GA4_EVENTS = {
    PAGE_VIEW: 'page_view',
    SCROLL: 'scroll',
    CLICK: 'click',
    VIEW_SEARCH_RESULTS: 'view_search_results',
    USER_ENGAGEMENT: 'user_engagement',
    FILE_DOWNLOAD: 'file_download',
    FORM_START: 'form_start',
    FORM_SUBMIT: 'form_submit'
};


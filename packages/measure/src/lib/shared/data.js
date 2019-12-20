import { readCookie, writeCookie } from './cookies';
import { parseUrl } from './url';
import {
	PARAMETERS_MAP,
	COOKIE_NAME,
	COOKIE_VALUE
} from '../constants';
const TWO_YEARS = 63072000000;

export const cacheBuster = () => {
	try {
		const n = new Uint32Array(1);
		window.crypto.getRandomValues(n);
		return n[0] & 2147483647;
	} catch (err) {
		return Math.round(2147483647 * Math.random());
	}
};

// https://gist.github.com/jed/982883
export const uuid = function b(a){ return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b); }; // eslint-disable-line func-style

//to do?
// "je", // Java enabled; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#je
// "fl", // Flash version; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#fl
export const systemInfo = () => ({
	[PARAMETERS_MAP.SCREEN_RESOLUTION]: window.screen ? `${window.screen.width}x${window.screen.height}`: null,
	[PARAMETERS_MAP.VIEWPORT_SIZE]: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
	[PARAMETERS_MAP.DOCUMENT_ENCODING]: document.characterSet,
	[PARAMETERS_MAP.SCREEN_COLORS]: window.screen ? `${window.screen.colorDepth}-bit`: null,
	[PARAMETERS_MAP.USER_LANGUAGE]: window.navigator.userLanguage || window.navigator.language
});

// for 'pageview' hits, either &dl or both &dh and &dp have to be specified for the hit to be valid
// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp
export const documentInfo = () => {
    const { host, pathname } = parseUrl(document.location.href);
    return {
        [PARAMETERS_MAP.DOCUMENT_LOCATION_URL]: document.location.href,
        [PARAMETERS_MAP.DOCUMENT_HOSTNAME]: host,
        [PARAMETERS_MAP.DOCUMENT_PATH]: pathname,
        [PARAMETERS_MAP.DOCUMENT_TITLE]: document.title
    };
};

export const clientId = () => {
	const cookie = readCookie({ name: COOKIE_NAME, value: COOKIE_VALUE });
	if (cookie) return cookie.value.replace(`${COOKIE_VALUE}.`, '');
	const cid = uuid();
	writeCookie({
		name: COOKIE_NAME,
		value: `${COOKIE_VALUE}.${cid}`,
		expiry: new Date(new Date().getTime() + TWO_YEARS).toGMTString()
	});
	return cid;
};

export const download = (link, types) => {
    for (let type of types){
        if (link.href.match(type.regex)) return type;
    }
    return false;
};
import { PARAMETERS_MAP, HOSTNAME } from '../constants/analytics';
const TWO_YEARS = 63072000000;

export const validateUUID = uuid => {
	if (!uuid) return false;
	uuid = uuid.toString().toLowerCase();
	return /[0-9a-f]{8}\-?[0-9a-f]{4}\-?4[0-9a-f]{3}\-?[89ab][0-9a-f]{3}\-?[0-9a-f]{12}/.test(uuid);
};

//to do
// "je", // Java enabled; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#je
// "fl", // Flash version; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#fl
export const systemInfo = () => ({
	[PARAMETERS_MAP.SCREEN_RESOLUTION]: window.screen ? `${window.screen.width}x${window.screen.height}`: null,
	[PARAMETERS_MAP.VIEWPORT_SIZE]: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
	[PARAMETERS_MAP.DOCUMENT_ENCODING]: document.characterSet,
	[PARAMETERS_MAP.SCREEN_COLORS]:  window.screen ? `${window.screen.colorDepth}-bit`: null,
	[PARAMETERS_MAP.USER_LANGUAGE]: window.navigator.userLanguage || window.navigator.language
});

// to do:
// "dl", //Document location URL; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dl
// "dh", //Document Host Name; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dh
// "dp", //Document Path, (for 'pageview' hits, either &dl or both &dh and &dp have to be specified for the hit to be valid) https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp
// "dt", //Document Title; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dh
export const documentInfo = () => ({
	[PARAMETERS_MAP.DOCUMENT_LOCATION_URL]: document.location.href,
	[PARAMETERS_MAP.DOCUMENT_TITLE]: document.title
})
	
export const request = url => {
	const img = document.createElement('img');
	img.width = 1;
	img.height = 1;
	img.src = url;
    return img
};

export const readCookie = settings => {
	const cookie = document.cookie
					.split('; ')
					.map(part => ({
						name: part.split('=')[0],
						value: part.split('=')[1]
					}))
					.filter(part => part.name === settings.cookieName)[0];
    return cookie !== undefined ? cookie : false
};

export const writeCookie = data => {
    document.cookie = [
        `${data.name}=${data.value};`,
        `expires=${data.expiry};`,
        data.path ? `path=${data.path}` : '',
        data.domain ? `domain=${data.domain}` : '',
        data.secure ? `secure` : ''
    ].join('');
};

export const cacheBuster = () => {
	try {
	  	const n = new Uint32Array(1);
	  	window.crypto.getRandomValues(n);
	  	return n[0] & 2147483647;
	} catch (err) {
		return Math.round(2147483647 * Math.random());
	}
};

//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const guid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
	let r = Math.random() * 16 | 0, 
		v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

export const clientId = settings => {
	const cookie = readCookie(settings);
	if(cookie) return cookie.value.replace(`${settings.cookieValue}.`, '');
	const cid = guid();
	writeCookie({
		name: settings.cookieName,
		value: `${settings.cookieValue}.${cid}`,
		expiry: new Date(new Date().getTime() + TWO_YEARS).toGMTString()
	})
	return cid;
};

export const composeURL = ({ data, action }) => `${HOSTNAME}/${action}?${Object.keys(data).reduce((acc, param) => {
	if(data[param] !== null) acc.push(`${param}=${encodeURIComponent(data[param])}`);
	return acc;
}, []).join('&')}`;
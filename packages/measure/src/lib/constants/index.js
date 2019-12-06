/* istanbul ignore file */
export const HOSTNAME = 'https://www.google-analytics.com';

export const PATH = '/collect';

// export const BATCH_PATH = '/batch';

// export const BATCHING = true;

// export const BATCH_SIZE = 10;

export const COOKIE_NAME = '_ga';

export const COOKIE_VALUE = 'GA';

export const TRIGGER_EVENTS = ['click', 'keyup'];

export const TRIGGER_KEYCODES = [13, 32];

export const ACCEPTED_PARAMETERS = [
	// General
	"v", //protocol version; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#v
	"tid", //Tracking ID / Web Property ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tid
	"aip", //Anonymize IP; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aip
	"ds", //Data Source; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ds
	"qt", //Queue time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#qt
	"z", //cache-buster; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#z

	// User
	"cid", //Client ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cid
	"uid", //User ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uid

	// Session
	//"sc", //Session control; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sc
	//"uip", // IP override; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uip
	//"ua", // User Agent Override; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua
	//"geoid", //Geographical Override; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#geoid

	// Traffic Sources
	//"dr", //document-referrer; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dr
	//"cn", //Campaign name; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cn
	//"cs", //Campaign source; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cs
	//"cm", //Campaign medium; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cm
	//"ck",  //Campaign keyword; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ck
	//"cc", //Campaign content; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cc
	//"ci", ///Campaign ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ci
	//"gclid", // Google Ads ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#gclid
	//"dclid", // Google Display Ads ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#gclid

	// System Info
	"sr", // Screen resolution; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sr
	"vp", // Viewport size; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#vs
	"de", // Document encoding; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#de
	"sd", // Screen colors; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sd
	"ul", // User language; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ul
	//"je", // Java enabled; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#je
	//"fl", // Flash version; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#fl

	// Hit
	"t", //hit type; required; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#t
	//"ni", //Non-interaction hit; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ni

	// Content Information
	"dl", //Document location URL; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dl
	"dh", //Document Host Name; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dh
	"dp", //Document Path, (for 'pageview' hits, either &dl or both &dh and &dp have to be specified for the hit to be valid) https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dp
	"dt", //Document Title; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dh
	//"cd", // Screen name; required on mobile properties for screenview hits; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd
	//"cg", //Content group; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cg_
	//"linkid", //Link ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#linkid

	// App Tracking
	//"an", //App name; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#an
	//"aid", //App ID ; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aid
	//"av", //App version; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#av
	//"aiid", //App installer ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aiid

	// Event Tracking
	"ec", //Event category; required for event hit type; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec
	"ea", //Event action; Required for event hit type. https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea
	"el", //Event label; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#el
	"ev", //Event value; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ev

	// E-commerce (transaction data: simple and enhanced)
	"ti", //transaction ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ti
	"ta", //transaction affiliation; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ta
	"tr", //transaction revenue; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tr
	"ts", //transaction shipping; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ts
	"tt", //transaction tax; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tt

	// E-commerce (item data: simple)
	//"in", //Item name; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#in
	//"ip", //Item price; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ip
	//"iq", //Item quantity; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#iq
	//"ic", //Item code; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ic
	//"iv", //Item category; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#iv 

	// E-commerce (currency: simple and enhanced)
	//"cu", //Currency code; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cu

	// Enhanced E-Commerce (see also: regex below)
	"pa", //Product action; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pa
	//"tcc", //Coupon code; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tcc
	//"pal", //Product action list; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pal
	"cos", //Checkout step; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cos
	"col", //Checkout step option; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#col
	//"promoa", //Promotion action; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#promoa

	// Social Interactions
	//"sn", //Social network; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sn
	//"sa", //Social action; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sa
	//"st", //Social action target; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#st

	// Timing
	//"utc", //User timing category; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#utc
	//"utv", //User timing variable name; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#utv
	//"utt", //User timing time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#utt
	//"utl", //User timing label; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#utl
	//"plt", //Page load time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#plt
	//"dns", //DNS time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dns
	//"pdt", //Page download time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pdt
	//"rrt", //Redirect response time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#rrt
	//"tcp", //TCP connect time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tcp
	//"srt", //Server response time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#srt
	//"dit", //DOM interactive time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dit
	//"clt", //Content load time; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#clt

	// Exceptions
	//"exd", //Excveption description; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#exd
	//exf", //Is exception fatal?; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#exf

	// Content Experiments
	//"xid", //Experiment ID; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#xid
	//"xvar" //Experiment variant; https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#xvar
];

export const ECOMMERCE_PARAMETERS = i => ({
	ACTION_LIST: `il${i}nm`,//??
});

export const CUSTOM_PARAMETERS = {
	DIMENSION: 'cd',
	METRIC: 'cm'
};

export const ECOMMERCE_IMPRESSION_PARAMETERS = (i, j) => ({
	IMPRESSION_LIST: `il${i}nm`,
	IMPRESSION_PRODUCT_ID: `il${i}pi${j}id`,
	IMPRESSION_PRODUCT_NAME: `il${i}pi${j}nm`,
	IMPRESSION_PRODUCT_CATEGORY: `il${i}pi${j}ca`,
	IMPRESSION_PRODUCT_BRAND: `il${i}pi${j}br`,
	IMPRESSION_PRODUCT_VARIANT: `il${i}pi${j}br`,
	IMPRESSION_PRODUCT_POSITION: `il${i}pi${j}ps`,
	IMPRESSION_PRODUCT_PRICE: `il${i}pi${j}pr`
});

export const ECOMMERCE_ACTIONS = {
	add: 'addToCart',
	remove: 'removeFromCart'
}

export const ECOMMERCE_PRODUCT_PARAMETERS = (i, j) => ({
	PRODUCT_ID: `pr${i}id`,
	PRODUCT_NAME: `pr${i}nm`,
	PRODUCT_CATEGORY: `pr${i}ca`,
	PRODUCT_BRAND: `pr${i}br`,
	PRODUCT_VARIANT: `pr${i}vs`,
	PRODUCT_QUANTITY: `pr${i}qt`,
	PRODUCT_PRICE: `pr${i}pr`
});

export const PERSISTENT_PARAMETERS = [
	"v",
	"cid",
	"uid",
	"tid",
	"aip",
	"ds",
	"sr",
	"vp",
	"de", 
	"sd",
	"ul",
];

export const EMAIL_REGEX = /^mailto:.*/

export const TEL_REGEX = /^tel:.*/;

export const CUSTOM_PARAM_REGEX = /^(dimension|metric)\d$/;

export const CUSTOM_PROPERTY_REGEX = /^(dimension|metric)/;


//to do - validate parameters?
// export const ACCEPTED_PARAMETERS_REGEX = [
// 	/^cm[0-9]+$/,
// 	/^cd[0-9]+$/,
// 	/^cg(10|[0-9])$/,

// 	/pr[0-9]{1,3}id/,
// 	/pr[0-9]{1,3}nm/,
// 	/pr[0-9]{1,3}br/,
// 	/pr[0-9]{1,3}ca/,
// 	/pr[0-9]{1,3}va/,
// 	/pr[0-9]{1,3}pr/,
// 	/pr[0-9]{1,3}qt/,
// 	/pr[0-9]{1,3}cc/,
// 	/pr[0-9]{1,3}ps/,
// 	/pr[0-9]{1,3}cd[0-9]{1,3}/,
// 	/pr[0-9]{1,3}cm[0-9]{1,3}/,

// 	/il[0-9]{1,3}nm/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}id/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}nm/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}br/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}ca/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}va/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}ps/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}pr/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}cd[0-9]{1,3}/,
// 	/il[0-9]{1,3}pi[0-9]{1,3}cm[0-9]{1,3}/,

// 	/promo[0-9]{1,3}id/,
// 	/promo[0-9]{1,3}nm/,
// 	/promo[0-9]{1,3}cr/,
// 	/promo[0-9]{1,3}ps/
// ];

export const PARAMETERS_MAP = {
	"PROTOCOL_VERSION": "v",
	"TRACKING_ID": "tid",
	"WEB_PROPERTY_ID": "tid",
	"ANONYMIZE_IP": "aip",
	"DATA_SOURCE": "ds",
	"QUEUE_TIME": "qt",
	"CACHE_BUSTER": "z",
	"CLIENT_ID": "cid",
	"USER_ID": "uid",
	//"SESSION_CONTROL": "sc",
	//"IP_OVEARRIDE": "uip",
	//"USER_AGENT_OVERRIDE": "ua",
	//"DOCUMENT_REFERRER": "dr",
	//"CAMPAIGN_NAME": "cn",
	//"CAMPAIGN_SOURCE": "cs",
	//"CAMPAIGN_MEDIUM": "cm",
	//"CAMPAIGN_KEYWORD": "ck",
	//"CAMPAIGN_CONTENT": "cc",
	//"CAMPAIGN_ID": "ci",
	//"GOOGLE_ADWORDS_ID": "gclid",
	//"GOOGLE_DISPLAY_ADS_ID": "dclid",
	"SCREEN_RESOLUTION": "sr",
	"VIEWPORT_SIZE": "vp",
	"DOCUMENT_ENCODING": "de",
	"SCREEN_COLORS": "sd",
	"USER_LANGUAGE": "ul",
	//"JAVA_ENABLED": "je",
	//"FLASH_VERSION": "fl",
	"HIT_TYPE": "t",
	//"NON_INTERACTION_HIT": "ni",
	"DOCUMENT_LOCATION_URL": "dl",
	"DOCUMENT_HOSTNAME": "dh",
	"DOCUMENT_PATH": "dp",
	"DOCUMENT_TITLE": "dt",
	//"SCREEN_NAME": "cd",
	//"LINK_ID": "linkid",
	//"APPLICATION_NAME": "an",
	//"APPLICATION_ID": "aid",
	//"APPLICATION_VERSION": "av",
	//"APPLICATION_INSTALLER_ID": "aiid",
	"EVENT_CATEGORY": "ec",
	"EVENT_ACTION": "ea",
	"EVENT_LABEL": "el",
	"EVENT_VALUE": "ev",
	"TRANSACTION_ID": "ti",
	"TRANSACTION_AFFILIATION": "ta",
	"TRANSACTION_REVENUE": "tr",
	"TRANSACTION_SHIPPING": "ts",
	"TRANSACTION_TAX": "tt",
	//"ITEM_NAME": "in",
	//"ITEM_PRICE": "ip",
	//"ITEM_QUANTITY": "iq",
	//"ITEM_CODE": "ic",
	//"ITEM_CATEGORY": "iv",
	//"CURRENCY_CODE": "cu",
	"PRODUCT_ACTION": "pa",
	"CHECKOUT_STEP": 'cos',
	"CHECKOUT_OPTION": 'col',
	//"SOCIAL_NETWORK": "sn",
	//"SOCIAL_ACTION": "sa",
	//"SOCIAL_ACTION_TARGET": "st",
	//"USER_TIMING_CATEGORY": "utc",
	//"USER_TIMING_VARIABLE_NAME": "utv",
	//"USER_TIMING_TIME": "utt",
	//"USER_TIMING_LABEL": "utl",
	//"PAGE_LOAD_TIME": "plt",
	//"DNS_TIME": "dns",
	//"PAGE_DOWNLOAD_TIME": "pdt",
	//"REDIRECT_RESPONSE_TIME": "rrt",
	//"TCP_CONNECT_TIME": "tcp",
	//"SERVER_RESPONSE_TIME": "srt",
	//"DOM_INTERACTIVE_TIME": "dit",
	//"CONTENT_LOAD_TIME": "clt",
	//"EXCEPTION_DESCRIPTION": "exd",
	//"IS_EXCEPTION_FATAL": "exf",
	//"IS_EXCEPTION_FATAL?": "exf",
	//"EXPERIMENT_ID": "xid",
	//"EXPERIMENT_VARIANT": "xvar"
};
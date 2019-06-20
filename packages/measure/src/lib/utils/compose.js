import {
    ACCEPTED_PARAMETERS,
	ECOMMERCE_IMPRESSION_PARAMETERS,
    PARAMETERS_MAP,
    HOSTNAME
} from '../constants';

export const url = ({ data, action }) => `${HOSTNAME}/${action}?${Object.keys(data).reduce((acc, param) => {
	if(data[param] !== null) acc.push(`${param}=${encodeURIComponent(data[param])}`);
	return acc;
}, []).join('&')}`;

export const stateFromOptions = ({ parameters, settings }) => ({
	parameters: parametersFromOptions(parameters),
	settings
});

const parametersFromOptions = parameters => Object.keys(parameters).reduce((acc, key) => {
	if(ACCEPTED_PARAMETERS.includes(key)) acc.persistent[key] = parameters[key];
	else if(PERSISTENT_PARAMETERS.includes(key)) acc.stack[key] = parameters[key];
	return acc;
}, { persistent: {}, stack: {} });

export const event = data => {
	return Object.keys(data).reduce((acc, key) => {
		const mapKey = `event_${key}`.toUpperCase();
		if(PARAMETERS_MAP[mapKey]) acc[PARAMETERS_MAP[mapKey]] = data[key];
		return acc;
	}, {});
};

export const linkEvent = (link, settings) => ({
    category: settings.category,
    label: settings.obfuscator ? settings.obfuscator.fn(link[settings.obfuscator.input]) : link.innerText,
    action: settings.obfuscator ? settings.obfuscator.fn(link[settings.obfuscator.input]) : link.href
});

export const impression = items => ({
	[PARAMETERS_MAP.EVENT_CATEGORY]: 'Ecommerce',
	[PARAMETERS_MAP.EVENT_ACTION]: 'Impression',
	...items.reduce(composeImpressionList, {})
});

const composeImpressionList = (acc, curr, i) => {
	const parameters = ECOMMERCE_IMPRESSION_PARAMETERS(i + 1);
	const items = curr.items.reduce((acc, curr, j) => {
			const parameters = ECOMMERCE_IMPRESSION_PARAMETERS(i + 1, j + 1);
			const products = Object.keys(curr).reduce((acc, param, k) => {
					acc[parameters[`IMPRESSION_PRODUCT_${param.toUpperCase()}`]] = curr[param];
					return acc;
				}, {});
			return { 
				...acc,
				...products
			}
		}, {});

	return {
		...acc,
		...{
			[parameters.IMPRESSION_LIST]: curr.name,
			...items
		}
	};
};
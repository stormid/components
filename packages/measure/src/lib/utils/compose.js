import {
    ACCEPTED_PARAMETERS,
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

export const ecommerce = data => {
	return data;
};
/*
&il1nm=Search%20Results                  // Impression list 1. Required.
&il1pi1id=P12345                         // Product Impression 1 ID. Either ID or name must be set.
&il1pi1nm=Android%20Warhol%20T-Shirt     // Product Impression 1 name. Either ID or name must be set.
&il1pi1ca=Apparel%2FT-Shirts             // Product Impression 1 category.
&il1pi1br=Google                         // Product Impression 1 brand.
&il1pi1va=Black                          // Product Impression 1 variant.
&il1pi1ps=1                              // Product Impression 1 position.
*/
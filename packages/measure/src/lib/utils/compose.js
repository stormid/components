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

//external link should be hostname property does not match location.hostname?
export const linkEvent = (link, settings) => ({
    category: settings.category,
    label: settings.obfuscator ? settings.obfuscator.fn(link[settings.obfuscator.input]) : link.innerText,
    action: settings.obfuscator ? settings.obfuscator.fn(link[settings.obfuscator.input]) : link.href
});
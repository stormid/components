import {
	HOSTNAME
} from '../constants';

export const url = ({ data, action }) => `${HOSTNAME}${action}?${Object.keys(data).reduce((acc, param) => {
	if (data[param] !== null) acc.push(`${param}=${encodeURIComponent(data[param])}`);
	return acc;
}, []).join('&')}`;


export const event = data => Object.assign({}, data);

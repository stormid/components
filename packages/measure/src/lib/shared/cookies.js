export const readCookie = settings => {
	const cookie = document.cookie
					.split('; ')
					.map(part => ({
						name: part.split('=')[0],
						value: part.split('=')[1]
					}))
					.filter(part => part.name === settings.name)[0];
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
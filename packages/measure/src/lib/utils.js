export const validateUUID = uuid => {
	if (!uuid) return false;
	uuid = uuid.toString().toLowerCase();
	return /[0-9a-f]{8}\-?[0-9a-f]{4}\-?4[0-9a-f]{3}\-?[89ab][0-9a-f]{3}\-?[0-9a-f]{12}/.test(uuid);
};

export const request = url => {
	const img = document.createElement('img');
	img.width = 1;
	img.height = 1;
	img.src = a;
    return b
};

/*
window.navigator.userLanguage || window.navigator.language
'en-GB'

document.characterSet
UTF-8

window.screen
{
availHeight: 1040
availLeft: 0
availTop: 0
availWidth: 1920
colorDepth: 24
height: 1080
orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
pixelDepth: 24
width: 1920
}
*/
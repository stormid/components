export const request = url => {
	if(navigator.sendBeacon) {
		navigator.sendBeacon(url);
		return;
	}
	const img = document.createElement('img');
	img.width = 1;
	img.height = 1;
	img.src = url;
    return img
};
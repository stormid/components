export const request = url => {
	const img = document.createElement('img');
	img.width = 1;
	img.height = 1;
	img.src = url;
    return img
};


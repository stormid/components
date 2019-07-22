const create = (url, async = true) => new Promise((resolve, reject) => {
	const s = document.createElement('script');
	s.src = url;
	s.async = async;
	s.onload = s.onreadystatechange = function() {
		if (!this.readyState || this.readyState === 'complete') resolve(true);
	};
	s.onerror = s.onabort = reject;
	document.head.appendChild(s);
});

export const series = urls => new Promise((resolve, reject) => {
	const next = () => {
		if (!urls.length) return resolve(true);
		create(urls.shift(), false).then(next).catch(reject);
	};
	next();
});

export default (urls, async = true) => {
	urls = [].concat(urls);
	if (!async) return series(urls);
	return Promise.all(urls.map(url => create(url)));
};
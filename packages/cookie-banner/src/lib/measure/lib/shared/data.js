export const cacheBuster = () => {
	try {
		const n = new Uint32Array(1);
		window.crypto.getRandomValues(n);
		return n[0] & 2147483647;
	} catch (err) {
		return Math.round(2147483647 * Math.random());
	}
};

// https://gist.github.com/jed/982883
export const uuid = function b(a){ return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b); }; // eslint-disable-line func-style


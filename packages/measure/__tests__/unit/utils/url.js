import { parseUrl } from '../../../src/lib/utils/url';

describe('Measure > utils > url', () => {
	
	it('parses the a URL and returns a location-like object', () => {
		const url = parseUrl('https://www.example.com:1234/path/to/file.html?a=b&c=d#hash');

		expect(url).toEqual({
			hash: '#hash',
			host: 'www.example.com:1234',
			hostname: 'www.example.com',
			href: 'https://www.example.com:1234/path/to/file.html?a=b&c=d#hash',
			origin: 'https://www.example.com:1234',
			pathname: '/path/to/file.html',
			port: '1234',
			protocol: 'https:',
			search: '?a=b&c=d',
		});
	});

	it('parses a sparse URL', () => {
		const url = parseUrl('http://example.com');

		expect(url).toEqual({
		hash: '',
		host: 'example.com',
		hostname: 'example.com',
		href: 'http://example.com/', // Note the trailing slash.
		origin: 'http://example.com',
		pathname: '/',
		port: '',
		protocol: 'http:',
		search: '',
		});
	});

	it('parses URLs relative to the root', () => {
		const url = parseUrl('/path/to/file.html?a=b&c=d#hash');

		// Specified portions of the URL.
		expect(url.hash).toEqual('#hash');
		expect(url.pathname).toEqual('/path/to/file.html');
		expect(url.search).toEqual('?a=b&c=d');

		// Non-specified portions of the URL should match `window.location`.
		expect(url.host).toEqual(location.host);
		expect(url.hostname).toEqual(location.hostname);
		expect(url.port).toEqual(location.port);
		expect(url.protocol).toEqual(location.protocol);

		// Not all browsers support the `origin` property, so we derive it.
		const origin = location.origin || location.protocol + '//' + location.host;
		expect(url.origin).toEqual(origin);
	});

	it('parses URLs relative to the file', () => {
		// Assumes the tests are hosted at `/test/`;
		const url = parseUrl('../path/to/file.html?a=b&c=d#hash');

		// Manually calculate the pathname since these tests run on servers as well
		// as using the file protocol.
		const pathname = location.pathname
			.replace(/test\/(index\.html)?/, '') + 'path/to/file.html';

		// Specified portions of the URL.
		expect(url.hash).toEqual('#hash');
		expect(url.pathname).toEqual(pathname);
		expect(url.search).toEqual('?a=b&c=d');

		// Non-specified portions of the URL should match `window.location`.
		expect(url.host).toEqual(location.host);
		expect(url.hostname).toEqual(location.hostname);
		expect(url.port).toEqual(location.port);
		expect(url.protocol).toEqual(location.protocol);

		// Not all browsers support the `origin` property, so we derive it.
		const origin = location.origin || location.protocol + '//' + location.host;
		expect(url.origin).toEqual(origin);
	});


	it('should resolve various relative path types', () => {
		const url1 = parseUrl('.');
		expect(url1.pathname).toEqual(location.pathname);

		const url2 = parseUrl('..');
		expect(url2.pathname).toEqual(location.pathname.replace(/test\/(index.html)?$/, ''));

		const url3 = parseUrl('./foobar.html');
		expect(url3.pathname).toEqual(location.pathname.replace(/(index.html)?$/, 'foobar.html'));
	});

	it('parses the current URL when given a falsy value', () => {
		const url = parseUrl();

		// Assumes the tests are hosted at `/test/`;
		expect(url.hash).toEqual(location.hash);
		expect(url.pathname).toEqual(location.pathname);
		expect(url.search).toEqual(location.search);

		// Non-specified portions of the URL should match `window.location`.
		expect(url.host).toEqual(location.host);
		expect(url.hostname).toEqual(location.hostname);
		expect(url.port).toEqual(location.port);
		expect(url.protocol).toEqual(location.protocol);

		// Not all browsers support the `origin` property, so we derive it.
		const origin = location.origin || location.protocol + '//' + location.host;
		expect(url.origin).toEqual(origin);

		expect(url).toEqual(parseUrl(null));
		expect(url).toEqual(parseUrl(''));
	});
});
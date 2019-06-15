import { request, composeURL, cacheBuster, guid } from '../../src/lib/utils';
import { HOSTNAME } from '../../src/lib/constants';
// -> https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits


describe(`Measure > hit validation`, () => {
    fetch = window.fetch;
    it('should ', async () => {
        const url = composeURL({
            data: {
                v: 1,
                t: 'pageview',
                tid: 'UA-141774857-1',
                cid: guid(),
                dp: '/',
                z: cacheBuster()
            }, 
            action: 'debug/collect'
        });
        const res = await fetch(url).then(res => res.json());
        expect(res.hitParsingResult[0].valid).toEqual(true);
        expect(res.hitParsingResult[0].hit).toEqual(url.replace(HOSTNAME, ''));
        expect(res.parserMessage[0].description).toEqual('Found 1 hit in the request.');
    });

});
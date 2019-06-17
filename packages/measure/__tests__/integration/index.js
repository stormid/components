import { url } from '../../src/lib/utils/compose';
import { cacheBuster, uuid } from '../../src/lib/utils/data';
import { HOSTNAME } from '../../src/lib/constants';
// -> https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits


describe(`Measure > hit validation`, () => {
    fetch = window.fetch;
    it('should send a hit request to Google Analytics', async () => {
        const reqUrl = url({
            data: {
                v: 1,
                t: 'pageview',
                tid: 'UA-141774857-1',
                cid: uuid(),
                dp: '/',
                z: cacheBuster()
            }, 
            action: 'debug/collect'
        });
        const res = await fetch(reqUrl).then(res => res.json());
        expect(res.hitParsingResult[0].valid).toEqual(true);
        expect(res.hitParsingResult[0].hit).toEqual(reqUrl.replace(HOSTNAME, ''));
        expect(res.parserMessage[0].description).toEqual('Found 1 hit in the request.');
    });

});

import { dataToURL, composeParams} from '../../src/lib/measurement';
import { HOSTNAME, MEASUREMENTS } from '../../src/lib/constants';
// -> https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits

describe(`Cookie banner > measure > hit validation`, () => {
    fetch = window.fetch;
    it('should send a hit request to Google Analytics for banner display event', async () => {
        const reqUrl = dataToURL({
            ...composeParams(12345, 'UA-141774857-1'),
            ...MEASUREMENTS.BANNER_DISPLAY,
            vp: '1024x768' //override 0x0 from JSDOM
        }, '/debug/collect');
        const res = await fetch(reqUrl).then(res => res.json());
        expect(res.hitParsingResult[0].valid).toEqual(true);
        expect(res.hitParsingResult[0].hit).toEqual(`${reqUrl.replace(`${HOSTNAME}/`, '')}?_anon_uip=0.0.0.0`);
        expect(res.parserMessage[0].description).toEqual('Found 1 hit in the request.');
    });

    it('should send a hit request to Google Analytics for banner accept event', async () => {
        const reqUrl = dataToURL({
            ...composeParams(12345, 'UA-141774857-1'),
            ...MEASUREMENTS.BANNER_ACCEPT,
            vp: '1024x768' //override 0x0 from JSDOM
        }, '/debug/collect');
        const res = await fetch(reqUrl).then(res => res.json());
        expect(res.hitParsingResult[0].valid).toEqual(true);
        expect(res.hitParsingResult[0].hit).toEqual(`${reqUrl.replace(`${HOSTNAME}/`, '')}?_anon_uip=0.0.0.0`);
        expect(res.parserMessage[0].description).toEqual('Found 1 hit in the request.');
    });

    it('should send a hit request to Google Analytics for banner options event', async () => {
        const reqUrl = dataToURL({
            ...composeParams(12345, 'UA-141774857-1'),
            ...MEASUREMENTS.BANNER_OPTIONS,
            vp: '1024x768' //override 0x0 from JSDOM
        }, '/debug/collect');
        const res = await fetch(reqUrl).then(res => res.json());
        expect(res.hitParsingResult[0].valid).toEqual(true);
        expect(res.hitParsingResult[0].hit).toEqual(`${reqUrl.replace(`${HOSTNAME}/`, '')}?_anon_uip=0.0.0.0`);
        expect(res.parserMessage[0].description).toEqual('Found 1 hit in the request.');
    });
    
    it('should send a hit request to Google Analytics for form display event', async () => {
        const reqUrl = dataToURL({
            ...composeParams(12345, 'UA-141774857-1'),
            ...MEASUREMENTS.FORM_DISPLAY,
            vp: '1024x768' //override 0x0 from JSDOM
        }, '/debug/collect');
        const res = await fetch(reqUrl).then(res => res.json());
        expect(res.hitParsingResult[0].valid).toEqual(true);
        expect(res.hitParsingResult[0].hit).toEqual(`${reqUrl.replace(`${HOSTNAME}/`, '')}?_anon_uip=0.0.0.0`);
        expect(res.parserMessage[0].description).toEqual('Found 1 hit in the request.');
    });

    it('should send a hit request to Google Analytics for save preferences event', async () => {
        const reqUrl = dataToURL({
            ...composeParams(12345, 'UA-141774857-1'),
            ...MEASUREMENTS.SAVE_PREFERENCES,
            vp: '1024x768' //override 0x0 from JSDOM
        }, '/debug/collect');
        const res = await fetch(reqUrl).then(res => res.json());
        expect(res.hitParsingResult[0].valid).toEqual(true);
        expect(res.hitParsingResult[0].hit).toEqual(`${reqUrl.replace(`${HOSTNAME}/`, '')}?_anon_uip=0.0.0.0`);
        expect(res.parserMessage[0].description).toEqual('Found 1 hit in the request.');
    });

});
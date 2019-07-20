import { url } from '../../../src/lib/shared/compose';
import { HOSTNAME } from '../../../src/lib/constants';

describe('Measure > collect > pageview', () => {
	
	it('should compose a request URL', () => {
        const requestUrl = url({ 
            data: {
                v: 1,
                t: 'pageview',
                tid: 'UA-141774857-1',
                cid: 'test',
                dp: '/',
                z: 'test-z'
            },
            action: 'collect'
        });
        expect(requestUrl).toEqual(`${HOSTNAME}/collect?v=1&t=pageview&tid=UA-141774857-1&cid=test&dp=%2F&z=test-z`);
    });
    
});
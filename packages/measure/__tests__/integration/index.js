import { url } from '../../src/lib/shared/compose';
import { cacheBuster, uuid } from '../../src/lib/shared/data';
import { HOSTNAME } from '../../src/lib/constants';
// -> https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits


describe(`Measure > hit validation`, () => {
    fetch = window.fetch;
    it('should send a hit request to Google Analytics', async () => {
        const reqUrl = url({
            data: {
                v: 1,
                t: 'pageview',
                tid: global.tid,
                cid: uuid(),
                dp: '/',
                z: cacheBuster()
            }, 
            action: '/debug/collect'
        });
        const res = await fetch(reqUrl).then(res => res.json());
        expect(res.hitParsingResult[0].valid).toEqual(true);
        expect(res.hitParsingResult[0].hit).toEqual(reqUrl.replace(HOSTNAME, ''));
        expect(res.parserMessage[0].description).toEqual('Found 1 hit in the request.');
    });

});




//ecommerce
    //impression
    //click
    //detail


    // __m.ecommerce.impression({
    //     label: 'Impression label',
    //     lists: [
    //         {
    //             name: 'Impression list 1',
    //             items: [
    //                 {
    //                     id: '1324',
    //                     name: 'Product 1',
    //                     category: 'Category 1',
    //                     price: '19.95',
    //                     brand: 'Google',
    //                     variant: 'Black',
    //                     position: '1'//1-200
    //                 },            
    //                 {
    //                     id: '5678',
    //                     name: 'Product 3',
    //                     category: 'Category 1',
    //                     price: '29.95',
    //                     brand: 'Apple',
    //                     variant: 'Black',
    //                     position: '2'
    //                 },            
    //                 {
    //                     id: '9101',
    //                     name: 'Product 5',
    //                     category: 'Category 1',
    //                     price: '9.95',
    //                     brand: 'Microsoft',
    //                     variant: 'Black',
    //                     position: '3'
    //                 }
    //             ]
    //         },
    //         {
    //             name: 'Impression list 2',
    //             items: [
    //                 {
    //                     id: '1123',
    //                     name: 'Product 2',
    //                     category: 'Category 1',
    //                     price: '5.95',
    //                     brand: 'Amazon',
    //                     variant: 'Black',
    //                     position: '4'//1-200
    //                 }
    //             ]
    //         }
    //     ]
    // });
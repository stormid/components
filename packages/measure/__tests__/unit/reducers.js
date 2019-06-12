import { initial, add, clear } from '../../src/lib/reducers';

describe(`Measure > reducers > initial`, () => {

    it('should return a new Object based on a data payload', async () => {
        const data = {
            persistent: { tid: 12345678980 }
        }
        expect(initial({}, data)).toEqual(data);
    });

});

describe(`Measure > reducers > add`, () => {

    it('should add to the stack property of an Object', async () => {
        const state = {
            persistent: { tid: 12345678980 },
            stack: {}
        };
        const data = {
            sr: `1024x768`,
            vp: `1024x768`,
            de: 'utf-8',
            sd: '24-bit'
        }
        expect(add(state, data)).toEqual({
            persistent: { tid: 12345678980 },
            stack: {
                sr: `1024x768`,
                vp: `1024x768`,
                de: 'utf-8',
                sd: '24-bit'
            }
        });
        expect(add({ persistent: { tid: 12345678980 }, stack: { dt: 'Test title' } }, data)).toEqual({
            persistent: { tid: 12345678980 },
            stack: {
                dt: 'Test title',
                sr: `1024x768`,
                vp: `1024x768`,
                de: 'utf-8',
                sd: '24-bit'
            }
        });
    });

});

describe(`Measure > reducers > clear`, () => {

    it('should empty the stack property of an Object', async () => {
        const data = {
            persistent: { tid: 12345678980 },
            stack: {
                dt: 'Test title',
                sr: `1024x768`,
                vp: `1024x768`,
                de: 'utf-8',
                sd: '24-bit'
            }
        }
        expect(clear(data)).toEqual({
            persistent: { tid: 12345678980 },
            stack: {}
        });
    });

});
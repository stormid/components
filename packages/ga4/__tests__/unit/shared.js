import { send, composeEventData } from '../../src/lib/shared';


//send


//composeEventData
/*
export const composeEventData = event => {
    let data = [];
    if (event) {
        if (!event.name) console.warn(`GA4: Missing event name`);
        else data.push([PARAMS.EVENT_NAME, event.name]);
        if (event.params) data = [ ...data, ...event.params ];
    }

    return data;
};
*/
describe('GA4 > Shared > composeEventData', () => {

    it('should return an empty array if no data', () => {
        expect(composeEventData()).toEqual([]);
    });

    it('should warn if no there is no event name', () => {
        const warningSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        expect(composeEventData({})).toEqual([]);
        expect(warningSpy).toHaveBeenCalledWith('GA4: Missing event name');
    });

    //add event to array
    //add event with params
    //add event with mulitple params

});
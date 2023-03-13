import { send, composeEventData } from '../../src/lib/shared';
import { GA4_EVENTS, PARAMS, ENDPOINT } from '../../src/lib/constants';

//composeEventData
describe('GA4 > Shared > composeEventData', () => {

    it('should return an empty array if no data', () => {
        expect(composeEventData()).toEqual([]);
    });

    it('should warn if no there is no event name', () => {
        const warningSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        expect(composeEventData({})).toEqual([]);
        expect(warningSpy).toHaveBeenCalledWith('GA4: Missing event name');
    });

    it('should add an event to an array', () => {
        expect(composeEventData({ name: GA4_EVENTS.PAGE_VIEW })).toEqual([[ PARAMS.EVENT_NAME, 'page_view']]);
    });

    it('should add event with params to an array', () => {
        expect(composeEventData({
            name: GA4_EVENTS.VIEW_SEARCH_RESULTS,
            params: [[ `${PARAMS.EVENT_PARAM}.search_term`, 'search term' ]]
        })).toEqual([
            [ PARAMS.EVENT_NAME, GA4_EVENTS.VIEW_SEARCH_RESULTS ],
            [ `${PARAMS.EVENT_PARAM}.search_term`, 'search term'],
        ]);
    });

    //add event with mulitple params
    it('should add event with multiple params to an array', () => {
        expect(composeEventData({
            name: GA4_EVENTS.FORM_SUBMIT,
            params: [
                [`${PARAMS.EVENT_PARAM}.form_id`, 'my-form' ],
                [`${PARAMS.EVENT_PARAM}.form_name`, 'my-form' ],
                [`${PARAMS.EVENT_PARAM}.form_destination`, '/submit' ],
                [`${PARAMS.EVENT_PARAM}.form_submit_text`, 'Submit' ],
                [ PARAMS.ENGAGEMENT_TIME, 12345 ]
            ]
        })).toEqual([
            [ PARAMS.EVENT_NAME, GA4_EVENTS.FORM_SUBMIT ],
            [`${PARAMS.EVENT_PARAM}.form_id`, 'my-form' ],
            [`${PARAMS.EVENT_PARAM}.form_name`, 'my-form' ],
            [`${PARAMS.EVENT_PARAM}.form_destination`, '/submit' ],
            [`${PARAMS.EVENT_PARAM}.form_submit_text`, 'Submit' ],
            [ PARAMS.ENGAGEMENT_TIME, 12345 ]
        ]);
    });

});


//send
describe('GA4 > Shared > send', () => {
    Object.defineProperty(window, 'navigator', {
        value: navigator,
        writable: true
    });

    it('should return if there is no base data', () => {
        global.navigator = {
            sendBeacon: jest.fn()
        };
        send({ data: { base: [] } });
        expect(global.navigator.sendBeacon).not.toHaveBeenCalled();
    });

    it('should merge event data with base data if only one event', () => {
        global.navigator = {
            sendBeacon: jest.fn()
        };
        send({ data: { base: [[PARAMS.PROTOCOL_VERSION, '2']], events: [[ PARAMS.EVENT_NAME, GA4_EVENTS.PAGE_VIEW]] } });
        expect(global.navigator.sendBeacon).toHaveBeenCalledWith(`${ENDPOINT}?${PARAMS.PROTOCOL_VERSION}=2&${PARAMS.EVENT_NAME}=${GA4_EVENTS.PAGE_VIEW}`, undefined);
    });

    it('should only send data with the beacon if more than 1 event', () => {
        global.navigator = {
            sendBeacon: jest.fn()
        };
        send({ data: {
            base: [[PARAMS.PROTOCOL_VERSION, '2']],
            events: [
                [ PARAMS.EVENT_NAME, GA4_EVENTS.PAGE_VIEW],
                [ PARAMS.EVENT_NAME, GA4_EVENTS.VIEW_SEARCH_RESULTS ],
                [ `${PARAMS.EVENT_PARAM}.search_term`, 'search term'],
            ]
        } });
        expect(global.navigator.sendBeacon).toHaveBeenCalledWith(`${ENDPOINT}?${PARAMS.PROTOCOL_VERSION}=2`, new URLSearchParams([
            [ PARAMS.EVENT_NAME, GA4_EVENTS.PAGE_VIEW],
            [ PARAMS.EVENT_NAME, GA4_EVENTS.VIEW_SEARCH_RESULTS ],
            [ `${PARAMS.EVENT_PARAM}.search_term`, 'search term'],
        ]));
    });

    it('should mutate state - clear queued base and event data from state, update firstEvent state, increment hitCount', () => {
        expect(send({
            data: {
                base: [[PARAMS.PROTOCOL_VERSION, '2']],
                events: [
                    [ PARAMS.EVENT_NAME, GA4_EVENTS.PAGE_VIEW],
                    [ PARAMS.EVENT_NAME, GA4_EVENTS.VIEW_SEARCH_RESULTS ],
                    [ `${PARAMS.EVENT_PARAM}.search_term`, 'search term'],
                ]
            },
            firstEvent: true,
            hitCount: 0
        })).toEqual({
            data: { base: [], events: [] },
            firstEvent: false,
            hitCount: 1
        });

    });

});
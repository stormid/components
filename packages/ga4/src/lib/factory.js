import { send, composeParams } from './shared';
import { GA4_EVENTS } from './constants';

export const track = (state, event) => {
    if (!event.type)  return console.warn(`GA4: Missing event type`);
    const params = composeParams(state, event);

    console.log(params);
    
    //mutaaaate...
    state.firstEvent = false;
};


/*
 *
 * @param tid, tracking id, 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 */
export default ({ tid, settings }) => {
    const state = { tid, settings, firstEvent: true };
    settings.autoTrack && track(state, { type: GA4_EVENTS.PAGE_VIEW });
    //setup eventlisteners

    return {
        track: track.bind(null, state)
    };
};
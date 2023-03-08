import { send, add, debounce, timer, hasSearchParams } from './shared';
import { GA4_EVENTS, PARAMS, SEARCH_QUERY_PARAMS } from './constants';
import { scroll, engagement, click } from './handlers';

const flush = debounce(send, 1000);

export const track = (state, event) => {
    state.data = add(state, event);
    flush(state);
};


/*
 *
 * @param tid, tracking id, 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 */
export default ({ tid, settings }) => {
    const state = {
        tid,
        settings,
        firstEvent: true,
        data: { base: [], events: [] },
        handlers: {},
        hitcount: 1,
        timer: timer()
    };
    state.timer.start();
    if (settings.autoTrack) {

        //page view
        track(state, { name: GA4_EVENTS.PAGE_VIEW });
       
        //view search results
        const search = document.location.search;
        if (hasSearchParams(search)) {
            const searchParams = new URLSearchParams(search);
            const searchTerm = SEARCH_QUERY_PARAMS.find(term => searchParams.get(term));
            track(state, {
                name: GA4_EVENTS.VIEW_SEARCH_RESULTS,
                params: [
                    { name: `${PARAMS.EVENT_PARAM}.search_term`, value: searchParams.get(searchTerm) },
                    { name: `${PARAMS.ENGAGEMENT_TIME}`, value: state.timer.get() }
                ]
            });
        }

        //EventListeners
        //1. scroll
        state.handlers.scroll = debounce(scroll(state));
        document.addEventListener('scroll', state.handlers.scroll);

        //2. user_engagement
        window.addEventListener('focus', state.timer.start);
        window.addEventListener('blur', state.timer.stop);
        window.addEventListener('pagehide', () => engagement(state));
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') engagement(state);
        });
        document.addEventListener('click', () => click(state));

    }


    return {
        track: track.bind(null, state)
    };
};
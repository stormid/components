import { queue, track } from './shared';
import { hasSearchParams, debounce, timer } from './utils';
import { GA4_EVENTS, PARAMS, SEARCH_QUERY_PARAMS } from './constants';
import { scroll, engagement, click, formStart, formSubmit } from './handlers';

/*
 *
 * @param tid, tracking id, 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 */
export default async ({ tid, settings }) => {
    const state = {
        tid,
        settings,
        firstEvent: true,
        data: { base: [], events: '' },
        handlers: {},
        forms: [],
        hitCount: 1,
        timer: timer()
    };
    state.timer.start();
    if (settings.autoTrack) {

        //1. page view
        await queue(state, { name: GA4_EVENTS.PAGE_VIEW });
       
        //2. view search results
        const search = document.location.search;
        if (hasSearchParams(search)) {
            const searchParams = new URLSearchParams(search);
            const searchTerm = SEARCH_QUERY_PARAMS.find(term => searchParams.get(term));
            await queue(state, {
                name: GA4_EVENTS.VIEW_SEARCH_RESULTS,
                params: [
                    [ `${PARAMS.EVENT_PARAM}.search_term`, searchParams.get(searchTerm) ],
                    [ `${PARAMS.ENGAGEMENT_TIME}`, state.timer.get() ]
                ]
            });
        }

        //EventListeners
        //3. scroll
        state.handlers.scroll = debounce(scroll(state));
        document.addEventListener('scroll', state.handlers.scroll);
        state.handlers.scroll();

        //4. user_engagement
        window.addEventListener('focus', state.timer.start);
        window.addEventListener('blur', state.timer.stop);
        // window.addEventListener('pagehide', () => engagement(state));
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') engagement(state);
        });

        //5. and 6. click and file_download
        document.addEventListener('click', click(state));

        //7. and 8. form_start and form_submit
        const forms = [].slice.call(document.querySelectorAll('form'));
        if (forms.length > 0) {
            state.handlers.forms = forms.map((form, idx) => {
                state.forms[idx] = { started: false };
                const startHandler = formStart(state, form, idx);
                form.addEventListener('change', startHandler);
                form.addEventListener('submit', formSubmit(state, form, idx));
                return startHandler;
            });
        }
    }


    return {
        track: track.bind(null, state),
        queue: queue.bind(null, state),
        getState() {
            return state;
        }
    };
};
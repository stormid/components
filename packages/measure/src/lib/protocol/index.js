import { url } from '../utils/compose';
import { cacheBuster, download } from '../utils/data';
import { request } from '../utils/request';
import { linkEvent, event } from '../utils/compose';
import { parseUrl } from '../utils/url';
import { clear } from '../reducers';
import { PATH, EMAIL_REGEX, TEL_REGEX } from '../constants';

export const send = (Store, type = 'pageview') => ({ persistent, stack }) => {
    request(url({
        data: {
            ...persistent,
            ...stack,
            t: type,
            z: cacheBuster()
        },
        action: PATH
    }));
    Store.dispatch(clear, {});
};

const handler = eventData => e => {
    if(3 === e.which) return;
    Store.dispatch(add, event(eventData), [ send(Store, 'event') ]);
};

export const links = Store => () => {
    const links = document.querySelectorAll('a');
    const state = Store.getState();
    const settings = state.settings;
    for(let link of links) {
        if(link.href.match(EMAIL_REGEX) && settings.email) {
            link.addEventListener('click', handler(linkEvent(link, settings.email)), { composed: true, useCapture: true });
            continue;
        }
        else if(link.href.match(TEL_REGEX) && settings.tel) {
            link.addEventListener('click', handler(linkEvent(link, settings.tel)), { composed: true, useCapture: true });
            continue;
        }
        if(settings.download){
            const downloadSettings = download(link, settings.download);
            if(downloadSettings) {
                link.addEventListener('click', handler(linkEvent(link, downloadSettings)), { composed: true, useCapture: true });
                continue;
            }
        }
        if(settings.external) {
            const { host } = parseUrl(document.location.href);
            const linkUrl = parseUrl(link.href);
            if(linkUrl.host !== host) {
                link.addEventListener('click', handler(linkEvent(link, settings.external)), { composed: true, useCapture: true });
                continue;
            }
        }
    }
};
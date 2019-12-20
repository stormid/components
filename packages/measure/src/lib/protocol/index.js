import { cacheBuster, download } from '../shared/data';
import { add, clear } from '../reducers';
import { request } from '../shared/request';
import { linkEvent, downloadEvent, event, url } from '../shared/compose';
import { parseUrl } from '../shared/url';
import {
    PATH,
    EMAIL_REGEX,
    TEL_REGEX,
    TRIGGER_EVENTS,
    TRIGGER_KEYCODES
} from '../constants';

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

const handler = (eventData, Store) => e => {
    if (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)
        || (e.which && e.which === 3)) return;
    Store.dispatch(add, event(eventData), [ send(Store, 'event') ]);
};

export const links = Store => () => {
    const links = document.querySelectorAll('a');
    const state = Store.getState();
    const settings = state.settings;
    for (let link of links) {
        if (link.href.match(EMAIL_REGEX) && settings.email) {
            TRIGGER_EVENTS.forEach(ev => {
                link.addEventListener(ev, handler(linkEvent(link, settings.email), Store), { composed: true, useCapture: true });
            });
            continue;
        } else if (link.href.match(TEL_REGEX) && settings.tel) {
            TRIGGER_EVENTS.forEach(ev => {
                link.addEventListener(ev, handler(linkEvent(link, settings.tel), Store), { composed: true, useCapture: true });
            });
            continue;
        }
        if (settings.download){
            const downloadSettings = download(link, settings.download.types);
            if (downloadSettings) {
                TRIGGER_EVENTS.forEach(ev => {
                    link.addEventListener(ev, handler(downloadEvent(link, downloadSettings), Store), { composed: true, useCapture: true });
                });
                continue;
            }
        }
        if (settings.external) {
            const { host } = parseUrl(document.location.href);
            const linkUrl = parseUrl(link.href);
            if (linkUrl.host !== host) {
                TRIGGER_EVENTS.forEach(ev => {
                    link.addEventListener(ev, handler(linkEvent(link, settings.external), Store), { composed: true, useCapture: true });
                });
                continue;
            }
        }
    }
};
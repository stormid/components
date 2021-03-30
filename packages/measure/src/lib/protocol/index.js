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
    const links = [].slice.call(document.querySelectorAll('a'));
    const state = Store.getState();
    const settings = state.settings;
    for (let index in links) {
        if (links[index].href.match(EMAIL_REGEX) && settings.email) {
            TRIGGER_EVENTS.forEach(ev => {
                links[index].addEventListener(ev, handler(linkEvent(links[index], settings.email), Store), { composed: true, useCapture: true });
            });
            continue;
        } else if (links[index].href.match(TEL_REGEX) && settings.tel) {
            TRIGGER_EVENTS.forEach(ev => {
                links[index].addEventListener(ev, handler(linkEvent(links[index], settings.tel), Store), { composed: true, useCapture: true });
            });
            continue;
        }
        if (settings.download){
            const downloadType = download(links[index], settings.download.types);

            if (downloadType) {
                settings.download.action = downloadType.action;
                TRIGGER_EVENTS.forEach(ev => {
                    links[index].addEventListener(ev, handler(downloadEvent(links[index], settings.download), Store), { composed: true, useCapture: true });
                });
                continue;
            } 
        }
        if (settings.external) {
            const { host } = parseUrl(document.location.href);
            const linkUrl = parseUrl(links[index].href);
            if (linkUrl.host !== host) {
                TRIGGER_EVENTS.forEach(ev => {
                    links[index].addEventListener(ev, handler(linkEvent(links[index], settings.external), Store), { composed: true, useCapture: true });
                });
                continue;
            }
        }
    }
};
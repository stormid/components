import { sanitise } from './utils';
import { ATTRIBUTE, EVENTS, KEYCODES } from './constants';

export const init = store => () => {
    const state = store.getState();
    const { settings, items, dom, activeIndex, node } = state;

    if (!dom.liveRegion) console.warn(`A live region announcing current and total items is recommended for screen readers.`);
    else writeLiveRegion(state);
    if (dom.fullscreen) {
        dom.fullscreen.addEventListener('click', toggleFullScreen.bind(null, store));
        document.addEventListener('fullscreenchange', e => {
            if (document.fullscreenElement) document.documentElement.classList.add(settings.className.fullscreen);
            else document.documentElement.classList.remove(settings.className.fullscreen);
        });
    }
    if (dom.previous) dom.previous.addEventListener('click', previous.bind(null, store));
    if (dom.next) dom.next.addEventListener('click', next.bind(null, store));
    if (dom.triggers.length) {
        dom.triggers.forEach(trigger => trigger.addEventListener('click', () => {
            goTo(store)(+trigger.getAttribute(ATTRIBUTE.NAVIGATE));
        }));
    }
    
    items.forEach((item, i) => {
        if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', 0);
        if (i === activeIndex) {
            if (!item.classList.contains(settings.className.active)) item.classList.add(settings.className.active);
            if (item.hasAttribute('aria-hidden')) item.removeAttribute('aria-hidden');
        } else {
            if (item.classList.contains(settings.className.active)) item.classList.remove(settings.className.active);
            if (!item.hasAttribute('aria-hidden')) item.setAttribute('aria-hidden', 'true');
        }
    });

    node.addEventListener('keydown', e => {
        switch (e.keyCode) {
        case KEYCODES.LEFT:
            previous(store);
            break;
        case KEYCODES.RIGHT:
            next(store);
            break;
        }
    });

    broadcast(store, EVENTS.INITIALISED)(state);
};

const writeLiveRegion = ({ activeIndex, items, settings, dom }) => dom.liveRegion.innerHTML = sanitise(settings.announcement(activeIndex + 1, items.length));

export const toggleFullScreen = store => {
    const { node } = store.getState();
    if (!document.fullscreenElement) {
        if (node.requestFullscreen) node.requestFullscreen();
    } else if (document.exitFullscreen) document.exitFullscreen();
};

export const change = (store, next, options = { fromListener: false }) => {
    const { activeIndex, items, settings } = store.getState();

    // Ensure any YouTube videos are stopped
    // let targetOrigin = 'https://www.youtube.com';
    // let youtube_iframes = [...document.querySelectorAll('.data-yt-iframe')];
    // if(youtube_iframes.length){
    //     youtube_iframes.forEach(youtube_iframe => {
    //         youtube_iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', targetOrigin);
    //     })
    // }

    //set activeIndex in state,
    //then run all side effects to change the DOM/show and hide items, manage focus, and load updated previous/next
    store.update({ ...store.getState(), activeIndex: next }, [
        () => {
            items[activeIndex].classList.remove('is--active');
            items[activeIndex].setAttribute('aria-hidden', 'true');
            items[next].classList.add('is--active');
            items[next].removeAttribute('aria-hidden');
        },
        () => items[next].focus(),
        writeLiveRegion,
        () => {
            const id = items[next].getAttribute('id');

            //TODO
            //don't pushState if this was fired from a hashchange event
            settings.updateURL && !options.fromListener && window.history.pushState({ URL: `#${id}` }, '', `#${id}`);
        },
        broadcast(store, EVENTS.CHANGE)
    ]);
};

export const broadcast = (store, eventType) => state => {
    const event = new CustomEvent(eventType, {
        bubbles: true,
        detail: {
            getState: store.getState
        }
    });
    state.node.dispatchEvent(event);
};

export const previous = store => {
    const { activeIndex, items } = store.getState();
    change(store, (activeIndex === 0 ? items.length - 1 : activeIndex - 1));
};

export const next = store => {
    const { activeIndex, items } = store.getState();
    change(store, (activeIndex === items.length - 1 ? 0 : activeIndex + 1));
};

export const goTo = store => i => {
    change(store, i);
};
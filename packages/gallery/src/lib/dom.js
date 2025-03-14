import { sanitise } from './utils';
import { ATTRIBUTE, EVENTS } from './constants';


/*
 * @param store, Object, store instance
 */
export const init = store => () => {
    const state = store.getState();
    const { settings, items, dom, activeIndex } = state;

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
        if (!item.node.hasAttribute('tabindex')) item.node.setAttribute('tabindex', 0);
        if (i === activeIndex) {
            if (!item.node.classList.contains(settings.className.active)) item.node.classList.add(settings.className.active);
            if (item.node.hasAttribute('aria-hidden')) item.node.removeAttribute('aria-hidden');
        } else {
            if (item.node.classList.contains(settings.className.active)) item.node.classList.remove(settings.className.active);
            if (!item.node.hasAttribute('aria-hidden')) item.node.setAttribute('aria-hidden', 'true');
        }
    });
    
};

const writeLiveRegion = ({ activeIndex, items, settings, dom }) => dom.liveRegion.innerHTML = sanitise(settings.announcement(activeIndex + 1, items.length));

export const toggleFullScreen = store => {
    const { node } = store.getState();
    if (!document.fullscreenElement) {
        if (node.requestFullscreen) node.requestFullscreen();
    } else if (document.exitFullscreen) document.exitFullscreen();
};

export const change = (store, next) => {
    const { activeIndex, items, settings, name } = store.getState();

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
            items[activeIndex].node.classList.remove('is--active');
            items[activeIndex].node.setAttribute('aria-hidden', 'true');
            items[next].node.classList.add('is--active');
            items[next].node.removeAttribute('aria-hidden');
        },
        () => items[next].node.focus(),
        writeLiveRegion,
        () => {
            const num = next + 1;
            settings.updateURL && window.history.replaceState({ URL: `#${name}-${num}` }, '', `#${name}-${num}`);
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
    broadcast(store, EVENTS.TRIGGERED);
};
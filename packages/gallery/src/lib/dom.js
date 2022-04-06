import { sanitise } from './utils';
import { ATTRIBUTE, EVENTS } from './constants';
import loaders from './loaders';

/*
 * Returns an array of Promises
 *
 * @param i, Number, index of item
 */
const loadItems = Store => i => {
    const { items, settings } = Store.getState();
    const indexes = [i];

    if (items.length > 1) indexes.push(i === 0 ? items.length - 1 : i - 1);
    if (items.length > 2) indexes.push(i === items.length - 1 ? 0 : i + 1);
    
    return indexes.map(idx => {
        if (!items[idx].loaded) {
            items[idx].node.classList.add(settings.className.loading);
            // return items[idx].mediaType === ATTRIBUTE.MEDIA_TYPE_VIDEO ?  loadVideo(Store)(items[idx], idx) : loadImage(Store)(items[idx], idx);
            return loaders[items[idx].mediaType];
            // return loadImage(Store)(items[idx], idx);
        }
    });

};

/*
 * Returns a Promise wrapping the loading image Promises using Promise.all
 *
 * @param i, Number, index of item
 */
export const init = Store => () => {
    const state = Store.getState();
    const { settings, items, dom, activeIndex } = state;
    
    //initialise buttons
    if (!dom.liveRegion) console.warn(`A live region announcing current and total items is recommended for screen readers.`);
    else writeLiveRegion(state);
    if (dom.fullscreen) {
        dom.fullscreen.addEventListener('click', toggleFullScreen.bind(null, Store));
        document.addEventListener('fullscreenchange', e => {
            if (document.fullscreenElement) document.documentElement.classList.add(settings.className.fullscreen);
            else document.documentElement.classList.remove(settings.className.fullscreen);
        });
    }
    if (dom.previous) dom.previous.addEventListener('click', previous.bind(null, Store));
    if (dom.next) dom.next.addEventListener('click', next.bind(null, Store));
    if (dom.triggers.length) {
        dom.triggers.forEach(trigger => trigger.addEventListener('click', () => {
            goTo(Store)(+trigger.getAttribute(ATTRIBUTE.NAVIGATE));
        }));
    }
    
    //set initial DOM state
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

    //preload all images if setting is true, or just previous and next
    if (settings.preload) return Promise.all(items.map(loadImage(Store)));
    return Promise.all(loadItems(Store)(activeIndex));
    
};

const writeLiveRegion = ({ activeIndex, items, settings, dom }) => dom.liveRegion.innerHTML = sanitise(settings.announcement(activeIndex + 1, items.length));

export const toggleFullScreen = Store => {
    const { node } = Store.getState();
    if (!document.fullscreenElement) {
        if (node.requestFullscreen) node.requestFullscreen();
    } else if (document.exitFullscreen) document.exitFullscreen();
};

export const change = (Store, next) => {
    const { activeIndex, items, settings, name } = Store.getState();

    // Ensure any YouTube videos are stopped
    let targetOrigin = 'https://www.youtube.com';
    let youtube_iframes = [...document.querySelectorAll('.data-yt-iframe')];
    if(youtube_iframes.length){
        youtube_iframes.forEach(youtube_iframe => {
            youtube_iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', targetOrigin);
        })
    }

    //set activeIndex in state,
    //then run all side effects to change the DOM/show and hide items, manage focus, and load updated previous/next
    Store.dispatch({ activeIndex: next }, [
        () => {
            items[activeIndex].node.classList.remove('is--active');
            items[activeIndex].node.setAttribute('aria-hidden', 'true');
            items[next].node.classList.add('is--active');
            items[next].node.removeAttribute('aria-hidden');
        },
        () => loadItems(Store)(next),
        () => items[next].node.focus(),
        writeLiveRegion,
        () => {
            const num = next + 1;
            settings.updateURL && window.history.replaceState({ URL: `#${name}-${num}` }, '', `#${name}-${num}`);
        },
        broadcast(Store, EVENTS.CHANGE)
    ]);
};

export const broadcast = (Store, eventType) => state => {
    const event = new CustomEvent(eventType, {
        bubbles: true,
        detail: {
            getState: Store.getState
        }
    });
    state.node.dispatchEvent(event);
};

export const previous = Store => {
    const { activeIndex, items } = Store.getState();
    change(Store, (activeIndex === 0 ? items.length - 1 : activeIndex - 1));
};

export const next = Store => {
    const { activeIndex, items } = Store.getState();
    change(Store, (activeIndex === items.length - 1 ? 0 : activeIndex + 1));
};

export const goTo = Store => i => {
    loadItems(Store)(i);
    change(Store, i);
    broadcast(Store, EVENTS.TRIGGERED);
};
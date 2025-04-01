import { sanitise, updateCSS } from './utils';
import { ATTRIBUTE, EVENTS, KEYCODES } from './constants';

export const init = store => () => {
    const state = store.getState();
    const { settings, dom, list } = state;

    if (!dom.liveRegion) console.warn(`A live region announcing current and total items is recommended for screen readers.`);
    else writeLiveRegion(state);
    /* istanbul ignore next */
    if (dom.fullscreen) {
        if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
            dom.fullscreen.addEventListener('click', toggleFullScreen.bind(null, store));
            document.addEventListener('fullscreenchange', e => {
                if (document.fullscreenElement) document.documentElement.classList.add(settings.className.fullscreen);
                else document.documentElement.classList.remove(settings.className.fullscreen);
            });
        } else dom.fullscreen.parentNode.removeChild(dom.fullscreen);
    }
    if (dom.previous) dom.previous.addEventListener('click', previous.bind(null, store));
    if (dom.next) dom.next.addEventListener('click', next.bind(null, store));
    if (dom.triggers.length) {
        dom.triggers.forEach(trigger => trigger.addEventListener('click', () => {
            goTo(store)(+trigger.getAttribute(ATTRIBUTE.NAVIGATE));
        }));
    }

    /* istanbul ignore next */
    list.addEventListener('keydown', e => {
        switch (e.keyCode) {
        case KEYCODES.LEFT:
            e.preventDefault();
            previous(store);
            break;
        case KEYCODES.RIGHT:
            e.preventDefault();
            next(store);
            break;
        // case KEYCODES.TAB:
        //     next(store);
        //     break;
        }
    });

    updateCSS(state);
    broadcast(store, EVENTS.INITIALISED)(state);
};

const writeLiveRegion = ({ activeIndex, items, settings, dom }) => dom.liveRegion.innerHTML = sanitise(settings.announcement(activeIndex + 1, items.length));

/* istanbul ignore next */
export const toggleFullScreen = store => {
    const { node } = store.getState();
    if (!document.fullscreenElement) {
        if (node.requestFullscreen) node.requestFullscreen();
        else if (node.webkitRequestFullscreen) node.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
};

export const change = (store, next, options = { fromListener: false, fromScroll: false }) => {
    const { list, items, settings } = store.getState();

    store.update({ ...store.getState(), activeIndex: next }, [
        () => {
            if (!options.fromScroll) list.scrollLeft = (next * items[next].clientWidth);
        },
        writeLiveRegion,
        updateCSS,
        () => {
            const id = items[next].getAttribute('id');
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
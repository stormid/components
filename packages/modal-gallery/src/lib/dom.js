import { KEYS, ACCEPTED_TRIGGERS } from './constants.js';
import { getFocusableChildren, escapeAttr } from './utils.js';

export const initTriggers = store => state => {
    const { items, settings } = state;
    
    items.map((item, i) => {
        if (!item.trigger) return;
        item.trigger.addEventListener('click', e => {
            e.preventDefault();
            open(store)(i);
        });
    });
    if (settings.preload) items.map(loadImage(store));
};

const loadImage = store => (item, i) => {
    try {
        const img = new Image();
        const loaded = () => {
            const state = store.getState();
            const { imageCache } = state;
            imageCache[i] = img;
            store.update({ ...state, imageCache });
            writeImage(state, i);
        };
        img.onload = loaded;
        if (item.srcset) img.srcset = item.srcset;
        if (item.sizes) img.sizes = item.sizes;
        img.src = item.src;
        if (img.complete) loaded();
    } catch (e) {
        console.warn(e);
    }
};

const loadImages = store => i => {
    const { imageCache, items, dom } = store.getState();
    const indexes = [i];

    if (items.length > 1) indexes.push(i === 0 ? items.length - 1 : i - 1);
    if (items.length > 2) indexes.push(i === items.length - 1 ? 0 : i + 1);
    indexes.forEach(idx => {
        if (imageCache[idx] === undefined) {
            dom.items[idx].classList.add('loading');
            loadImage(store)(items[idx], idx);
        } else {
            /* Already cached (e.g. a reopened gallery, or a preload that completed
               before this DOM existed) — the fresh DOM has no <img> yet, so paint it. */
            writeImage(store.getState(), idx);
        }
    });

};

export const initUI = store => state => {
    const { settings, items, current, keyListener } = store.getState();
    const container = document.body.appendChild(settings.templates.overlay());
    const buttons = items.length > 1 ? settings.templates.buttons() : '';
    container.insertAdjacentHTML('beforeend', settings.templates.overlayInner(buttons, items.map(item => settings.templates.details(item, settings.headingLevel)).map(settings.templates.item(items)).join('')));
    const domItems = Array.from(container.querySelectorAll('.js-modal-gallery__item'));
    const domTotals = container.querySelector('.js-gallery-totals');
    const domStatus = container.querySelector('.js-modal-gallery__status');
    store.update({
        ...store.getState(),
        dom: {
            overlay: container,
            items: domItems,
            totals: domTotals,
            status: domStatus,
            focusableChildren: getFocusableChildren(container),
            //where focus returns to on close: whatever was focused when the gallery opened, falling
            //back to the trigger of the opened item — a mouse click doesn't focus the trigger in every
            //browser (notably WebKit), so document.activeElement can be the body at this point
            lastFocused: (document.activeElement && document.activeElement !== document.body)
                ? document.activeElement
                : ((items[current] && items[current].trigger) || null),
            bodyOverflow: document.body.style.overflow
        }
    }, [
        load(store),
        initUIButtons(store),
        () => document.addEventListener('keydown', keyListener),
        lockBackground(store),
        toggle(store),
        writeTotals,
        writeStatus
    ]);
};

/*
 * Turns the page behind the open modal into a true modal context: stops the body scrolling
 * and marks every sibling of the overlay inert (removing it from the tab order and the
 * accessibility tree). Only elements this component marks are un-set on close, so pre-existing
 * inert/overflow state is left untouched. Both behaviours are opt-out via settings.
 */
const lockBackground = store => () => {
    const { settings, dom } = store.getState();
    if (settings.lockScroll) document.body.style.overflow = 'hidden';
    if (settings.inertBackground) {
        Array.from(document.body.children).forEach(child => {
            if (child === dom.overlay || child.hasAttribute('inert')) return;
            child.setAttribute('inert', '');
            child.setAttribute('data-modal-gallery-inert', '');
        });
    }
};

const unlockBackground = store => () => {
    const { settings, dom } = store.getState();
    if (settings.lockScroll) document.body.style.overflow = dom.bodyOverflow || '';
    if (settings.inertBackground) {
        Array.from(document.querySelectorAll('[data-modal-gallery-inert]')).forEach(el => {
            el.removeAttribute('inert');
            el.removeAttribute('data-modal-gallery-inert');
        });
    }
};

const load = store => state => {
    const { imageCache, items, current } = store.getState();
    if (Object.keys(imageCache).length === items.length) imageCache.map((img, i) => { writeImage(state, i); });
    else loadImages(store)(current);
};

const writeImage = (state, i) => {
    const { dom, settings, items } = state;
    if (!dom) return;
    const imageContainer = dom.items[i].querySelector('.js-modal-gallery__img-container');
    const img = imageContainer.querySelector('.modal-gallery__img');
    if (img) return;
    const imageClassName = settings.scrollable ? 'modal-gallery__img modal-gallery__img--scrollable' : 'modal-gallery__img';
    const srcsetAttribute = items[i].srcset ? ` srcset="${escapeAttr(items[i].srcset)}"` : '';
    const sizesAttribute = items[i].sizes ? ` sizes="${escapeAttr(items[i].sizes)}"` : '';

    //a programmatic item may carry no title; fall back to an empty alt (correct for an image with
    //no text alternative) rather than rendering the literal alt="undefined"
    imageContainer.innerHTML = `<img class="${imageClassName}" src="${escapeAttr(items[i].src)}" alt="${escapeAttr(items[i].title || '')}"${srcsetAttribute}${sizesAttribute}>`;
    dom.items[i].classList.remove('loading');
};

const initUIButtons = store => state => {
    const { dom } = store.getState();

    const composeSelector = classSelector => ACCEPTED_TRIGGERS.map(sel => `${sel}.${classSelector}`).join(', ');

    const closeBtn = dom.overlay.querySelector(composeSelector('js-modal-gallery__close'));
    if (closeBtn) {
        closeBtn.addEventListener('click', e => {
            close(store);
        });
    } else {
        console.warn('No close buttons or links found.');
    }

    const previousBtn = dom.overlay.querySelector(composeSelector('js-modal-gallery__previous'));
    const nextBtn = dom.overlay.querySelector(composeSelector('js-modal-gallery__next'));
    if (!previousBtn && !nextBtn) {
        console.warn('No next or previous buttons or links found.');
        return;
    }

    previousBtn && previousBtn.addEventListener('click', e => {
        previous(store);
    });
    nextBtn && nextBtn.addEventListener('click', e => {
        next(store);
    });
};

export const keyListener = store => e => {
    const { isOpen } = store.getState();
    if (!isOpen) return;
    switch (e.key) {
    case KEYS.ESC:
        close(store);
        break;
    case KEYS.TAB:
        trapTab(store, e);
        break;
    case KEYS.LEFT:
        previous(store);
        break;
    case KEYS.RIGHT:
        next(store);
        break;
    default:
        break;
    }
};

const trapTab = (store, e) => {
    const { dom } = store.getState();
    if (!dom.focusableChildren || dom.focusableChildren.length === 0) return;
    // fully manage Tab rather than leaning on the browser's native tab order: WebKit leaves
    // <button>/<a> out of the keyboard tab sequence by default, so a boundary-only trap (one that
    // only intervenes at the first/last child) leaks out of an overlay whose only focusable
    // children are buttons and links. Moving focus explicitly on every Tab traps it everywhere.
    e.preventDefault();
    const children = dom.focusableChildren;
    const lastIndex = children.length - 1;
    const focusedIndex = children.indexOf(document.activeElement);
    let nextIndex;
    if (focusedIndex === -1) nextIndex = 0;                                       // focus escaped the set — pull it back to the first
    else if (e.shiftKey) nextIndex = focusedIndex === 0 ? lastIndex : focusedIndex - 1;
    else nextIndex = focusedIndex === lastIndex ? 0 : focusedIndex + 1;
    children[nextIndex].focus();
};

const toggle = store => state => {
    const { dom, current, isOpen, settings } = store.getState();
    dom.overlay.classList.toggle('is--active');
    dom.overlay.setAttribute('aria-hidden', !isOpen);
    dom.overlay.setAttribute('tabindex', isOpen ? '0' : '-1');
    current !== null && dom.items[current].classList.add('is--active');
    window.setTimeout(() => {
        const target = dom.overlay.querySelector('.js-modal-gallery__close')
            || (dom.focusableChildren && dom.focusableChildren[0])
            || dom.overlay;
        if (target) target.focus();
    }, 0);

    settings.fullscreen && toggleFullScreen(state);
};

const writeTotals = ({ dom, current, items, settings }) => {
    if (settings.totals) dom.totals.innerHTML = `${current + 1}/${items.length}`;
};

/* Announces the current position (and title) to assistive tech via a dedicated live region;
   textContent is used so titles can never inject markup. */
const writeStatus = ({ dom, current, items }) => {
    if (!dom.status || current === null) return;
    const title = items[current] && items[current].title ? `, ${items[current].title}` : '';
    dom.status.textContent = `Image ${current + 1} of ${items.length}${title}`;
};

const toggleFullScreen = ({ isOpen, dom }) => {
    if (isOpen){
        dom.overlay.requestFullscreen && dom.overlay.requestFullscreen();
        /* node:coverage ignore next */
        dom.overlay.webkitRequestFullscreen && dom.overlay.webkitRequestFullscreen();
        /* node:coverage ignore next */
        dom.overlay.mozRequestFullScreen && dom.overlay.mozRequestFullScreen();
    } else {
        /* node:coverage ignore next */
        document.exitFullscreen && document.exitFullscreen();
        /* node:coverage ignore next */
        document.mozCancelFullScreen && document.mozCancelFullScreen();
        /* node:coverage ignore next */
        document.webkitExitFullscreen && document.webkitExitFullscreen();
    }
};

export const previous = store => {
    const { current, dom } = store.getState();
    const next = current === 0 ? dom.items.length - 1 : current - 1;
    store.update({
        ...store.getState(),
        current: next
    }, [
        () => dom.items[current].classList.remove('is--active'),
        () => dom.items[next].classList.add('is--active'),
        load(store),
        writeTotals,
        writeStatus
    ]);
};

export const next = store => {
    const { current, dom } = store.getState();
    const next = current === dom.items.length - 1 ? 0 : current + 1;
    store.update({
        ...store.getState(),
        current: next
    }, [
        () => dom.items[current].classList.remove('is--active'),
        () => dom.items[next].classList.add('is--active'),
        load(store),
        writeTotals,
        writeStatus
    ]);
};

export const close = store => {
    const { keyListener, dom, settings } = store.getState();
    store.update({
        ...store.getState(),
        current: null,
        isOpen: false
    }, [
        () => document.removeEventListener('keydown', keyListener),
        () => { if (settings.fullscreen) toggleFullScreen(store.getState()); },
        unlockBackground(store),
        //return focus to the trigger before the overlay (which holds the focused close button) is removed
        () => { if (dom.lastFocused && typeof dom.lastFocused.focus === 'function') dom.lastFocused.focus(); },
        () => dom.overlay.parentNode.removeChild(dom.overlay)
    ]);
};

export const open = store => (i = 0) => {
    store.update(
        {
            ...store.getState(),
            current: i,
            isOpen: true
        },
        [ initUI(store) ]
    );
};
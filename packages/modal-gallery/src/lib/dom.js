import { KEY_CODES, ACCEPTED_TRIGGERS } from './constants';
import { getFocusableChildren } from './utils';

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
        }
    });

};

export const initUI = store => state => {
    const { settings, items, keyListener } = store.getState();
    const container = document.body.appendChild(settings.templates.overlay());
    const buttons = items.length > 1 ? settings.templates.buttons() : '';
    container.insertAdjacentHTML('beforeend', settings.templates.overlayInner(buttons, items.map(settings.templates.details).map(settings.templates.item(items)).join('')));
    const domItems = [].slice.call(container.querySelectorAll('.js-modal-gallery__item'));
    const domTotals = container.querySelector('.js-gallery-totals');
    store.update({
        ...store.getState(),
        dom: {
            overlay: container,
            items: domItems,
            totals: domTotals,
            focusableChildren: getFocusableChildren(container),
            lastFocused: document.activeElement
        }
    }, [
        load(store),
        initUIButtons(store),
        () => document.addEventListener('keydown', keyListener),
        toggle(store),
        writeLiveRegion
    ]);
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
    const srcsetAttribute = dom.items[i].srcset ? ` srcset="${dom.items[i].srcset}"` : '';
    const sizesAttribute = dom.items[i].sizes ? ` sizes="${dom.items[i].sizes}"` : '';
    
    imageContainer.innerHTML = `<img class="${imageClassName}" src="${items[i].src}" alt="${items[i].title}"${srcsetAttribute}${sizesAttribute}>`;
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
    switch (e.keyCode) {
    case KEY_CODES.ESC:
        close(store);
        break;
    case KEY_CODES.TAB:
        trapTab(store, e);
        break;
    case KEY_CODES.LEFT:
        previous(store);
        break;
    case KEY_CODES.RIGHT:
        next(store);
        break;
    default:
        break;
    }
};

const trapTab = (store, e) => {
    const { dom } = store.getState();
    const focusedIndex = dom.focusableChildren.indexOf(document.activeElement);
    if (e.shiftKey && focusedIndex === 0) {
        /* istanbul ignore next */
        e.preventDefault();
        dom.focusableChildren[dom.focusableChildren.length - 1].focus();
    }
    /* istanbul ignore next */
    if (!e.shiftKey && focusedIndex === dom.focusableChildren.length - 1) {
        e.preventDefault();
        dom.focusableChildren[0].focus();
    }
};

const toggle = store => state => {
    const { dom, current, isOpen, settings } = store.getState();
    dom.overlay.classList.toggle('is--active');
    dom.overlay.setAttribute('aria-hidden', !isOpen);
    dom.overlay.setAttribute('tabindex', isOpen ? '0' : '-1');
    isOpen !== null && dom.items[current].classList.add('is--active');
    if (dom.focusableChildren && dom.focusableChildren.length > 0) window.setTimeout(() => { dom.focusableChildren[0].focus(); }, 0);

    settings.fullscreen && toggleFullScreen(state);
};

const writeLiveRegion = ({ dom, current, items, settings }) => {
    if (settings.totals) dom.liveRegions.innerHTML = `${current + 1}/${items.length}`;
};

const toggleFullScreen = ({ isOpen, dom }) => {
    if (isOpen){
        dom.overlay.requestFullscreen && dom.overlay.requestFullscreen();
        /* istanbul ignore next */
        dom.overlay.webkitRequestFullscreen && dom.overlay.webkitRequestFullscreen();
        /* istanbul ignore next */
        dom.overlay.mozRequestFullScreen && dom.overlay.mozRequestFullScreen();
    } else {
        /* istanbul ignore next */
        document.exitFullscreen && document.exitFullscreen();
        /* istanbul ignore next */
        document.mozCancelFullScreen && document.mozCancelFullScreen();
        /* istanbul ignore next */
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
        writeLiveRegion
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
        writeLiveRegion
    ]);
};

export const close = store => {
    const { keyListener, lastFocused, dom } = store.getState();
    store.update({
        ...store.getState(),
        current: null,
        isOpen: false
    }, [
        () => document.removeEventListener('keydown', keyListener),
        () => { if (lastFocused) lastFocused.focus(); },
        // () => dom.items[current].classList.remove('is--active'),
        // toggle(store),
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
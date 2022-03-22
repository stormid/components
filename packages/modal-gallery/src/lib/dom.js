import { KEY_CODES, ACCEPTED_TRIGGERS } from './constants';
import { getFocusableChildren } from './utils';

export const initTriggers = Store => state => {
    const { items, settings } = state;
    
    items.map((item, i) => {
        if (!item.trigger) return;
        item.trigger.addEventListener('click', e => {
            e.preventDefault();
            open(Store)(i);
        });
    });
    if (settings.preload) items.map(loadImage(Store));
};

const loadImage = Store => (item, i) => {
    try {
        const img = new Image();
        const loaded = () => {
            const { imageCache } = Store.getState();
            imageCache[i] = img;
            Store.dispatch({ imageCache });
            writeImage(Store.getState(), i);
        };
        img.onload = loaded;
        img.src = item.src;
        if (img.complete) loaded();
    } catch (e) {
        console.warn(e);
    }
};

const loadImages = Store => i => {
    const { imageCache, items, dom } = Store.getState();
    const indexes = [i];

    if (items.length > 1) indexes.push(i === 0 ? items.length - 1 : i - 1);
    if (items.length > 2) indexes.push(i === items.length - 1 ? 0 : i + 1);
    indexes.forEach(idx => {
        if (imageCache[idx] === undefined) {
            dom.items[idx].classList.add('loading');
            loadImage(Store)(items[idx], idx);
        }
    });

};

export const initUI = Store => state => {
    const { settings, items, keyListener } = Store.getState();
    const container = document.body.appendChild(settings.templates.overlay());
    const buttons = items.length > 2 ? settings.templates.buttons() : '';
    container.insertAdjacentHTML('beforeend', settings.templates.overlayInner(buttons, items.map(settings.templates.details).map(settings.templates.item(items)).join('')));
    const domItems = [].slice.call(container.querySelectorAll('.js-modal-gallery__item'));
    const domTotals = container.querySelector('.js-gallery-totals');
    Store.dispatch({ dom: {
        overlay: container,
        items: domItems,
        totals: domTotals,
        focusableChildren: getFocusableChildren(container),
        lastFocused: document.activeElement
    } }, [
        load(Store),
        initUIButtons(Store),
        () => document.addEventListener('keydown', keyListener),
        toggle(Store),
        writeTotals
    ]);
};

const load = Store => state => {
    const { imageCache, items, current } = Store.getState();
    if (Object.keys(imageCache).length === items.length) imageCache.map((img, i) => { writeImage(state, i); });
    else loadImages(Store)(current);
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

const initUIButtons = Store => state => {
    const { dom } = Store.getState();

    const composeSelector = classSelector => { return ACCEPTED_TRIGGERS.map(sel => `${sel}.${classSelector}`).join(", "); }

    const closeBtn = dom.overlay.querySelector(composeSelector("js-modal-gallery__close"));
    if(closeBtn) {
        closeBtn.addEventListener('click', e => {
            close(Store);
        });
    } else {
        console.warn('No close buttons or links found.')
    }

    const previousBtn = dom.overlay.querySelector(composeSelector("js-modal-gallery__previous"));
    const nextBtn = dom.overlay.querySelector(composeSelector("js-modal-gallery__next"));
    if (!previousBtn && !nextBtn) {
        console.warn('No next or previous buttons or links found.')
        return;
    }

    previousBtn && previousBtn.addEventListener('click', e => {
        previous(Store);
    });
    nextBtn && nextBtn.addEventListener('click', e => {
        next(Store);
    });
};

export const keyListener = Store => e => {
    const { isOpen } = Store.getState();
    if (!isOpen) return;
    switch (e.keyCode) {
        case KEY_CODES.ESC:
            close(Store);
            break;
        case KEY_CODES.TAB:
            trapTab(Store, e);
            break;
        case KEY_CODES.LEFT:
            previous(Store);
            break;
        case KEY_CODES.RIGHT:
            next(Store);
            break;
        default:
            break;
    }
};

const trapTab = (Store, e) => {
    const { dom } = Store.getState();
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

const toggle = Store => state => {
    const { dom, current, isOpen, settings } = Store.getState();
    dom.overlay.classList.toggle('is--active');
    dom.overlay.setAttribute('aria-hidden', !isOpen);
    dom.overlay.setAttribute('tabindex', isOpen ? '0' : '-1');
    isOpen !== null && dom.items[current].classList.add('is--active');
    if (dom.focusableChildren && dom.focusableChildren.length > 0) window.setTimeout(() => { dom.focusableChildren[0].focus(); }, 0);

    settings.fullscreen && toggleFullScreen(state);
};

const writeTotals = ({ dom, current, items, settings }) => {
    if (settings.totals) dom.totals.innerHTML = `${current + 1}/${items.length}`;
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

export const previous = Store => {
    const { current, dom } = Store.getState();
    const next = current === 0 ? dom.items.length - 1 : current - 1;
    Store.dispatch({ current: next }, [
        () => dom.items[current].classList.remove('is--active'),
        () => dom.items[next].classList.add('is--active'),
        load(Store),
        writeTotals
    ]);
};

export const next = Store => {
    const { current, dom } = Store.getState();
    const next = current === dom.items.length - 1 ? 0 : current + 1;
    Store.dispatch({ current: next }, [
        () => dom.items[current].classList.remove('is--active'),
        () => dom.items[next].classList.add('is--active'),
        load(Store),
        writeTotals
    ]);
};

export const close = Store => {
    const { keyListener, lastFocused, dom } = Store.getState();
    Store.dispatch({ current: null, isOpen: false }, [
        () => document.removeEventListener('keydown', keyListener),
        () => { if (lastFocused) lastFocused.focus(); },
        // () => dom.items[current].classList.remove('is--active'),
        // toggle(Store),
        () => dom.overlay.parentNode.removeChild(dom.overlay)
    ]);
};

export const open = Store => (i = 0) => {
    Store.dispatch(
        { current: i, isOpen: true },
        [ initUI(Store) ]
    );
};
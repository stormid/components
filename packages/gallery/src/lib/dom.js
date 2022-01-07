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
    const { settings, items } = Store.getState();
    //write UI to target container
    //persistent UI:
        //buttons?
        //menu?
        //totals?
        //list
    //items with image container, title, description
    const container = document.querySelector(settings.container);
    if (!container) return void console.warn(`Gallery cannot be initialised, ${settings.container} not found`);
    container.appendChild(settings.templates.container(items));
    

    //if (settings.preload) items.map(loadImage(Store));


    // Store.dispatch({ dom: {
    //     container,
    //     items,
    //     totals
    // } }, [
    //     load(Store),
    //     initUIButtons(Store),
    //     writeTotals
    // ]);
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
    const closeBtn = dom.overlay.querySelector('.js-modal-gallery__close');
    TRIGGER_EVENTS.forEach(ev => {
        closeBtn.addEventListener(ev, e => {
            if ((e.keyCode && e.keyCode !== KEY_CODES.ENTER) || (e.which && e.which === 3)) return;
            close(Store);
        });
    });

    const previousBtn = dom.overlay.querySelector('.js-modal-gallery__previous');
    const nextBtn = dom.overlay.querySelector('.js-modal-gallery__next');
    if (!previousBtn && !nextBtn) return;

    TRIGGER_EVENTS.forEach(ev => {
        previousBtn && previousBtn.addEventListener(ev, e => {
            if (e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
            previous(Store);
        });
        nextBtn && nextBtn.addEventListener(ev, e => {
            if (e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
            next(Store);
        });
    });
};


const writeTotals = ({ dom, current, items, settings }) => {
    if (settings.totals) dom.totals.innerHTML = `${current + 1}/${items.length}`;
};

export const toggleFullScreen = Store => {
    const { isFullScreen, container } = Store.getState();
    if (isFullScreen){
        container.requestFullscreen && container.requestFullscreen();
        /* istanbul ignore next */
        container.webkitRequestFullscreen && container.webkitRequestFullscreen();
        /* istanbul ignore next */
        container.mozRequestFullScreen && container.mozRequestFullScreen();
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
import { sanitise } from './utils';

const loadImage = Store => (item, i) => {
    //detect if loaded
    //check for loaded data attribute
    //src, srcset, sizes, or sources
    const img = item.node.querySelector('img');
    if (!img) return void console.warn('Gallery cannot find image');

    try {
        //add support for picture tags (sources)
        // const picture = item.node.querySelector('picture');
        
        const loaded = () => {
            const { items, loadingClassName } = Store.getState();
            items[i].loaded = true;
            console.log('loaded');
            item.node.classList.remove(loadingClassName);
            Store.dispatch({ items });
        };
        img.onload = loaded;
        if (item.srcset) img.setAttribute('srcset', item.srcset);
        if (item.src) img.setAttribute('src', item.src);
        if (item.sizes) img.setAttribute('sizes', item.sizes);
        if (img.complete) loaded();
    } catch (e) {
        console.warn('Gallery cannot load image', e);
    };
};

const loadImages = Store => i => {
    const { items, loadingClassName } = Store.getState();
    const indexes = [i];

    if (items.length > 1) indexes.push(i === 0 ? items.length - 1 : i - 1);
    if (items.length > 2) indexes.push(i === items.length - 1 ? 0 : i + 1);
    indexes.forEach(idx => {
        if (!items[idx].loaded) {
            items[idx].node.classList.add(loadingClassName);
            loadImage(Store)(items[idx], idx);
        }
    });

};

export const init = Store => () => {
    const state = Store.getState();
    const { settings, items, dom, current } = state;
    
    //initialise buttons
    if (!dom.total) console.warn(`A live region announcing current and total items is recommended for screen readers.`);
    else writeTotals(state);
    if (dom.fullscreen) dom.fullscreen.addEventListener('click', toggleFullScreen.bind(null, Store));
    if (dom.previous) dom.previous.addEventListener('click', previous.bind(null, Store));
    if (dom.next) dom.next.addEventListener('click', next.bind(null, Store));

    //preload all images if setting is true, or just previous and next
    if (settings.preload) items.map(loadImage(Store));
    else loadImages(Store)(current);

    //ensure current item is active
    if (!items[current].node.classList.contains(settings.currentClassName)) !items[current].node.classList.add(settings.currentClassName);
};

const writeTotals = ({ current, items, settings, dom }) => dom.total.innerHTML = sanitise(settings.announcement(current + 1, items.length));

export const toggleFullScreen = Store => {
    const { node } = Store.getState();
    if (!document.fullscreenElement) node.requestFullscreen && node.requestFullscreen();
    else document.exitFullscreen && document.exitFullscreen();
};

//!refactor
//lots of duplication between previous and next functions
export const previous = Store => {
    const { current, items } = Store.getState();
    const next = current === 0 ? items.length - 1 : current - 1;
    
    Store.dispatch({ current: next }, [
        () => {
            items[current].node.classList.remove('is--active');
            items[current].node.setAttribute('aria-hidden', 'true');
        },
        () => {
            items[next].node.classList.add('is--active');
            items[current].node.removeAttribute('aria-hidden');
        },
        () => loadImages(Store)(next),
        writeTotals
    ]);
};

export const next = Store => {
    const { current, items } = Store.getState();
    const next = current === items.length - 1 ? 0 : current + 1;
    Store.dispatch({ current: next }, [
        () => {
            items[current].node.classList.remove('is--active');
            items[current].node.setAttribute('aria-hidden', 'true');
        },
        () => {
            items[next].node.classList.add('is--active');
            items[current].node.removeAttribute('aria-hidden');
        },
        () => loadImages(Store)(next),
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

// export const open = Store => (i = 0) => {
//     Store.dispatch(
//         { current: i, isOpen: true },
//         [ initUI(Store) ]
//     );
// };
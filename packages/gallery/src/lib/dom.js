import { sanitise } from './utils';

const loadSources = (picture, item) => {
    if (item.sources && item.sources.length > 0) {
        for (let i in item.sources){
            const source = document.createElement('source');
            if (item.sources[i].srcset) source.setAttribute('srcset', item.sources[i].srcset);
            if (item.sources[i].media) source.setAttribute('media', item.sources[i].media);
            if (item.sources[i].type) source.setAttribute('srcset', item.sources[i].type);
            picture.insertBefore(source, picture.firstElementChild);
        }
    }
};

/*
 * Returns an array of Promises
 *
 * @param i, Number, index of item
 */
const loadImage = Store => (item, i) => new Promise((resolve, reject) => {
    const img = item.node.querySelector('img');
    const picture = item.node.querySelector('picture');
    try {
        const loaded = () => {
            const { items, loadingClassName } = Store.getState();
            items[i].loaded = true;
            item.node.classList.remove(loadingClassName);
            Store.dispatch({ items });
            resolve(img);
        };
        if (picture) loadSources(item);

        img.onload = loaded;
        if (item.srcset) img.setAttribute('srcset', item.srcset);
        if (item.src) img.setAttribute('src', item.src);
        if (item.sizes) img.setAttribute('sizes', item.sizes);
        if (img.complete) loaded();
    } catch (e) {
        console.warn('Gallery cannot load image', e);
        reject(img);
    };
});

/*
 * Returns an array of Promises
 *
 * @param i, Number, index of item
 */
const loadImages = Store => i => {
    const { items, loadingClassName } = Store.getState();
    const indexes = [i];

    if (items.length > 1) indexes.push(i === 0 ? items.length - 1 : i - 1);
    if (items.length > 2) indexes.push(i === items.length - 1 ? 0 : i + 1);
    return indexes.forEach(idx => {
        if (!items[idx].loaded) {
            items[idx].node.classList.add(loadingClassName);
            return loadImage(Store)(items[idx], idx);
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
    const { settings, items, dom, current } = state;
    
    //initialise buttons
    if (!dom.total) console.warn(`A live region announcing current and total items is recommended for screen readers.`);
    else writeTotals(state);
    if (dom.fullscreen) dom.fullscreen.addEventListener('click', toggleFullScreen.bind(null, Store));
    if (dom.previous) dom.previous.addEventListener('click', previous.bind(null, Store));
    if (dom.next) dom.next.addEventListener('click', next.bind(null, Store));
    
    //set initial DOM state
    items.forEach((item, i) => {
        if (i === current) {
            if (!item.node.classList.contains(settings.currentClassName)) item.node.classList.add(settings.currentClassName);
            if (item.node.hasAttribute('aria-hidden')) item.node.removeAttribute('aria-hidden');
        } else {
            if (item.node.classList.contains(settings.currentClassName)) item.node.classList.remove(settings.currentClassName);
            if (!item.node.hasAttribute('aria-hidden')) item.node.setAttribute('aria-hidden', 'true');
        }
    });

    //preload all images if setting is true, or just previous and next
    if (settings.preload) return Promise.all(items.map(loadImage(Store)));
    return Promise.all(loadImages(Store)(current));
    
};

const writeTotals = ({ current, items, settings, dom }) => dom.total.innerHTML = sanitise(settings.announcement(current + 1, items.length));

export const toggleFullScreen = Store => {
    const { node } = Store.getState();
    if (!document.fullscreenElement) node.requestFullscreen && node.requestFullscreen();
    else document.exitFullscreen && document.exitFullscreen();
};

export const change = (Store, next) => {
    const { current, items } = Store.getState();

    Store.dispatch({ current: next }, [
        () => {
            items[current].node.classList.remove('is--active');
            items[current].node.setAttribute('aria-hidden', 'true');
        },
        () => {
            items[next].node.classList.add('is--active');
            items[next].node.removeAttribute('aria-hidden');
        },
        () => loadImages(Store)(next),
        writeTotals
    ]);
};

export const previous = Store => {
    const { current, items } = Store.getState();
    change(Store, (current === 0 ? items.length - 1 : current - 1));
};

export const next = Store => {
    const { current, items } = Store.getState();
    change(Store, (current === items.length - 1 ? 0 : current + 1));
};

export const goTo = Store => i => {
    loadImages(Store)(i);
    change(Store, i);
};
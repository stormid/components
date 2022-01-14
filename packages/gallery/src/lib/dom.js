import { sanitise } from './utils';
import { ATTRIBUTE } from './constants';

const createPicture = item => {
    const picture = document.createElement('picture');
    for (let i in item.sources){
        const source = document.createElement('source');
        if (item.sources[i].srcset) source.setAttribute('srcset', item.sources[i].srcset);
        if (item.sources[i].media) source.setAttribute('media', item.sources[i].media);
        if (item.sources[i].type) source.setAttribute('type', item.sources[i].type);
        picture.insertBefore(source, picture.firstElementChild);
    }
    return picture;
};

/*
 * Returns an array of Promises
 *
 * 
 * @param i, Number, index of item
 */
const loadImage = Store => (item, i) => new Promise((resolve, reject) => {
    const { items, settings } = Store.getState();

    // We're here because the library does not think that the item is loaded
    // because the item does not have the ATTRIBUTE.LOADED attribute,
    // and the imgNode src does not match the item ATTRIBUTE.SRC
    // therefore we can assume that any img (or SVG) present is a loading state and should be removed when the 
    const loadingIndicator = item.imgContainer.querySelector(`img, svg, .${settings.className.loader}`);
    // const loadingIndicator = item.imgContainer.querySelector(`img, svg, .${settings.className.loader}`);

    const img = new Image();
    let picture = false;
    try {
        const loaded = () => {
            item.loaded = true;
            item.node.classList.remove(settings.className.loading);
            item.node.setAttribute(ATTRIBUTE.LOADED, true);
            item.img = img;
            Store.dispatch({ items: items.map((_item, idx) => i === idx ? item : _item ) });
            resolve(img);
        };
        img.onload = loaded;
        if (item.srcset) img.setAttribute('srcset', item.srcset);
        if (item.src) img.setAttribute('src', item.src);
        if (item.sizes) img.setAttribute('sizes', item.sizes);
        //assume picture tag is not present and we need to create it if there are item.sources
        if (item.sources && item.sources.length > 0) picture = createPicture(item);
        if (img.complete) loaded();
        if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
        if (picture) {
            picture.appendChild(img);
            item.imgContainer.appendChild(picture);
        } else item.imgContainer.appendChild(img);

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
    const { items, settings } = Store.getState();
    const indexes = [i];

    if (items.length > 1) indexes.push(i === 0 ? items.length - 1 : i - 1);
    if (items.length > 2) indexes.push(i === items.length - 1 ? 0 : i + 1);
    
    return indexes.map(idx => {
        if (!items[idx].loaded) {
            items[idx].node.classList.add(settings.className.loading);
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
    const { settings, items, dom, activeIndex } = state;
    
    //initialise buttons
    if (!dom.total) console.warn(`A live region announcing current and total items is recommended for screen readers.`);
    else writeTotals(state);
    if (dom.fullscreen) dom.fullscreen.addEventListener('click', toggleFullScreen.bind(null, Store));
    if (dom.previous) dom.previous.addEventListener('click', previous.bind(null, Store));
    if (dom.next) dom.next.addEventListener('click', next.bind(null, Store));
    
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
    return Promise.all(loadImages(Store)(activeIndex));
    
};

const writeTotals = ({ activeIndex, items, settings, dom }) => dom.total.innerHTML = sanitise(settings.announcement(activeIndex + 1, items.length));

export const toggleFullScreen = Store => {
    const { node } = Store.getState();
    if (!document.fullscreenElement) node.requestFullscreen && node.requestFullscreen();
    else document.exitFullscreen && document.exitFullscreen();
};

export const change = (Store, next) => {
    const { activeIndex, items } = Store.getState();

    //set activeIndex in state,
    //then run all side effects to change the DOM/show and hide items, manage focus, and load updated previous/next
    Store.dispatch({ activeIndex: next }, [
        () => {
            items[activeIndex].node.classList.remove('is--active');
            items[activeIndex].node.setAttribute('aria-hidden', 'true');
        },
        () => {
            items[next].node.classList.add('is--active');
            items[next].node.removeAttribute('aria-hidden');
        },
        () => loadImages(Store)(next),
        () => items[next].node.focus(),
        writeTotals
    ]);
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
    loadImages(Store)(i);
    change(Store, i);
};
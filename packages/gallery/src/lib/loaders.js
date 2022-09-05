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
 * @param i, Number, index of item
 */
export const loadImage = Store => (item, i) => new Promise((resolve, reject) => {
    const { items, settings } = Store.getState();

    // We're here because the library does not think that the item is loaded
    // because the item does not have the ATTRIBUTE.LOADED attribute,
    // and the imgNode src does not match the item ATTRIBUTE.SRC
    // therefore we can assume that any img (or SVG) present is a loading state and should be removed when the 
    const loadingIndicator = item.imgContainer.querySelector(`img, svg, ${settings.selector.loader}`);
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
//we need to wrap this in cookie consent
//either delegate all video rendering to cookie banner or somehow use event system from banner to connect correct consent event with video rendering
export const loadYT = Store => (item, i) => new Promise((resolve, reject) => {
    const { items, settings } = Store.getState();
    
    const loadingIndicator = item.imgContainer.querySelector(`img, svg, ${settings.selector.loader}`);
    const video = document.createElement('iframe');
    const videoSrc = item.src;

    video.setAttribute('class','data-yt-iframe');
    video.setAttribute('allowfullscreen','');
    video.setAttribute('frameborder','0');
    video.setAttribute('src','https://www.youtube.com/embed/'+ videoSrc +'?rel=0&showinfo=0&autoplay=0&enablejsapi=1');
    
    item.loaded = true;
    item.node.classList.remove(settings.className.loading);
    item.node.setAttribute(ATTRIBUTE.LOADED, true);
    Store.dispatch({ items: items.map((_item, idx) => i === idx ? item : _item ) });
    if (loadingIndicator) loadingIndicator.parentNode.removeChild(loadingIndicator);
    item.imgContainer.appendChild(video);

    resolve(item);
});
*/

export default {
    image: loadImage,
    // youtube: loadYT
};
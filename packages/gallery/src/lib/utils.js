import { ATTRIBUTE } from './constants';

export const sanitise = item => item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const composeItems = (nodes, settings) => nodes.map(node => {
    const sourcesValue = node.getAttribute(ATTRIBUTE.SOURCES);
    let sources = false;
    if (sourcesValue) {
        try {
            sources = JSON.parse(sourcesValue);
        } catch (e) {
            console.warn('Gallery cannot parse sources', e);
        }
    }
    let item = {
        node,
        sources,
        srcset: node.getAttribute(ATTRIBUTE.SRCSET),
        sizes: node.getAttribute(ATTRIBUTE.SIZES),
        src: node.getAttribute(ATTRIBUTE.SRC),
        alt: node.getAttribute(ATTRIBUTE.ALT),
    };
    //must contain an img container element
    const imgContainer = node.querySelector(settings.selector.imgContainer);
    if (!imgContainer) return console.warn(`Gallery cannot find image container ${settings.selector.imgContainer}`), item;
    const imgNode = imgContainer.querySelector('img');

    item = {
        ...item,
        imgContainer,
        loaded: node.hasAttribute(ATTRIBUTE.LOADED) || (imgNode && imgNode.getAttribute('src') === node.getAttribute(ATTRIBUTE.SRC))
    };
    if (!item.sources && !item.srcset && !item.src && !item.loaded) return void console.warn('Gallery cannot be initialised, no image sources found'), item;

    return item;
});

export const composeDOM = (node, settings) => ({
    total: node.querySelector(settings.selector.total),
    fullscreen: node.querySelector(settings.selector.fullscreen),
    previous: node.querySelector(settings.selector.previous),
    next: node.querySelector(settings.selector.next)
});
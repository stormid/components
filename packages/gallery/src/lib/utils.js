import { ATTRIBUTE } from './constants';

export const sanitise = item => item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const composeItems = nodes => nodes.map(node => {
    //must contain an img element
    const imgNode = node.querySelector('img');
    if (!imgNode) return void console.warn('Gallery cannot find image');

    const item = {
        node,
        sources: node.getAttribute(ATTRIBUTE.SOURCES),
        srcset: node.getAttribute(ATTRIBUTE.SRCSET),
        sizes: node.getAttribute(ATTRIBUTE.SIZES),
        src: node.getAttribute(ATTRIBUTE.SRC),
        alt: node.getAttribute(ATTRIBUTE.ALT),
        loaded: node.hasAttribute(ATTRIBUTE.LOADED) || imgNode.getAttribute('src') === node.getAttribute(ATTRIBUTE.SRC)
    };
    if (!item.sources && !item.srcset && !item.src && !item.loaded) return void console.warn('Gallery cannot be initialised, no image sources found');
    return item;
});

export const composeDOM = (node, settings) => ({
    total: node.querySelector(settings.selector.total),
    fullscreen: node.querySelector(settings.selector.fullscreen),
    previous: node.querySelector(settings.selector.previous),
    next: node.querySelector(settings.selector.next)
});
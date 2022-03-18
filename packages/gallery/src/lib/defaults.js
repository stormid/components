/* istanbul ignore file */

export default {
    name: false, //for setting the URL, of not set (false) it will get it from the id the container node, or just 'gallery'
    preload: false,
    totals: true,
    startIndex: 0,
    selector: {
        item: '[data-gallery-item]',
        fullscreen: '[data-gallery-fullscreen]',
        liveRegion: '[data-gallery-live-region]',
        previous: '[data-gallery-previous]',
        next: '[data-gallery-next]',
        imgContainer: '[data-gallery-item-img-container]',
        loader: '[data-gallery-item-loader]',
        navigate: '[data-gallery-navigate]'
    },
    className: {
        active: 'is--active',
        loading: 'is--loading',
        fullscreen: 'is--fullscreen'
    },
    manualInitialisation: false, //if the gallery is hidden (e.g. in a modal) we may wish to delay initialisation and image loading until it is activiated
    updateURL: true, //change URL when item changes
    announcement(current, total){
        return `${current} of ${total}`;
    }
};
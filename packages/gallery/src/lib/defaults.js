/* istanbul ignore file */

export default {
    preload: false,
    totals: true,
    startIndex: 0,
    selector: {
        item: '[data-gallery-item]',
        fullscreen: '[data-gallery-fullscreen]',
        total: '[data-gallery-total]',
        previous: '[data-gallery-previous]',
        next: '[data-gallery-next]',
        imgContainer: '[data-gallery-img-container]'
    },
    className: {
        active: 'is--active',
        loading: 'is--loading',
        img: 'gallery-item__image'
    },
    manualInitialisation: false, //if the gallery is hidden (e.g. in a modal) we may wish to delay initialisation and image loading until it is activiated
    updateURL: true, //change URL when item changes
    announcement(current, total){
        return `${current} of ${total}`;
    }
};
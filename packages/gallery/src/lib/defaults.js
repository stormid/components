/* istanbul ignore file */

export default {
    name: false, //for setting the URL, if not set (false) it will get it from the id the container node, or just 'gallery'
    startIndex: 0,
    selector: {
        item: '[data-gallery-item]',
        fullscreen: '[data-gallery-fullscreen]',
        liveRegion: '[data-gallery-live-region]',
        previous: '[data-gallery-previous]',
        next: '[data-gallery-next]',
        navigate: '[data-gallery-navigate]'
    },
    className: {
        active: 'is--active',
        fullscreen: 'is--fullscreen'
    },
    manualInitialisation: false, //if the gallery is hidden (e.g. in a modals) we may wish to delay initialisation
    updateURL: true, //change URL when item changes
    announcement(current, total){
        return `${current} of ${total}`;
    }
};
export const findSlides = (node, settings) => [].slice.call(node.querySelectorAll(settings.itemSelector))
    .map(slide => ({
        unloadedImgs: [].slice.call(slide.querySelectorAll('[data-srcset], [data-src]')),
        container: slide
    }));
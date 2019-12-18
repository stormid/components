export const findSlides = (node, settings) => [].slice.call(node.querySelectorAll(settings.itemSelector))
    .map(slide => ({
        preload: [].slice.call(slide.querySelectorAll('[data-srcset], [data-src]')),
        container: slide
    }));

export const autoplay = Store => () => {};

/*
autoPlay(slideDuration) {
        this.interval = setInterval(() => {
            this.next();
        }, slideDuration ? slideDuration * 1000 : 5000);
    }
    */


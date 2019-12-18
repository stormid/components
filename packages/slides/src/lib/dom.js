import { TRIGGER_EVENTS, KEY_CODES } from './constants';

export const setCurrent = ({ slides, settings, currentIndex, navItems, notification }) => {
    slides[currentIndex].container.classList.add(settings.activeClass);
    slides[currentIndex].container.setAttribute('tabindex', '-1');
    navItems.length > 0 && navItems[currentIndex].setAttribute('aria-current', true);
    notification.innerHTML = `Slide ${currentIndex + 1} of ${slides.length}`;
};

export const initUI = Store => ({ nextButton, previousButton, navItems }) => {
    TRIGGER_EVENTS.forEach(triggerEvent => {
        if (nextButton) {
            nextButton.addEventListener(triggerEvent, event => {
                if (event.keyCode && event.keyCode !== KEY_CODES.ENTER) return;
                const { currentIndex, slides } = Store.getState();

                //to do
                //change fn
                //reset, preload next images, prepare classes based on direction 
                Store.dispatch({ currentIndex: currentIndex === slides.length - 1 ? 0 : currentIndex + 1 }, [ setCurrent ]);
            });
        }
        if (previousButton) {
            previousButton.addEventListener(triggerEvent, event => {
                if (event.keyCode && event.keyCode !== KEY_CODES.ENTER) return;
                const { currentIndex, slides } = Store.getState();
                //to do
                //change fn
                //reset, preload next images, prepare classes based on direction 
                Store.dispatch({ currentIndex: currentIndex === 0 ? slides.length - 1 : currentIndex - 1 }, [ setCurrent ]);
            });
        }
        if (navItems.length > 0) {
            navItems.forEach((item, i)	 => {
                item.addEventListener(triggerEvent, e => {
                    if (e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
                    change(i);
                });
            });
        }
    });
};

export const preload = Store => ({ slides, settings, currentIndex }) => {
    if (settings.preload) slides.forEach((slide, i) => loadImage(Store, i))
    else loadImages(Store, currentIndex);
};

const loadImage = (Store, i) => {
    const { slides } = Store.getState();

    if (slides[i].preload.length === 0) return;
    // slides[i].container.classList.add(settings.loadingClass);
    slides[i].preload.forEach(el => {
        ['src', 'srcset'].forEach(type => {
            if (el.hasAttribute(`data-${type}`)) {
                el.setAttribute(type, el.getAttribute(`data-${type}`));
                el.removeAttribute(`data-${type}`);
            }
            // this.slides[i].container.classList.remove(settings.loadingClass);
        });
    );
    //extract this to a testable reducer
    Store.dispatch({ slides: slides.map((slide, idx) => idx === i ? { ...slide, { preload: [] } } : slide) });
};

const loadImages = (Store, i) => {
    const { node, slides } = Store.getState();
    let indexes = [i];

    if (slides.length > 1) indexes.push(i === 0 ? slides.length - 1 : i - 1);
    if (slides.length > 2) indexes.push(i === slides.length - 1 ? 0 : i + 1);

    indexes.forEach(idx => loadImage(Store, idx));
};
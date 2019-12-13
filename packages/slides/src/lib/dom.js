import { TRIGGER_EVENTS, KEY_CODES } from './constants';

export const setCurrent = ({ slides, settings, currentIndex, navItems, notification }) => {
    slides[currentIndex].container.classList.add(settings.activeClass);
    slides[currentIndex].container.setAttribute('tabindex', '-1');
    navItems.length && this.navItems[currentIndex].setAttribute('aria-current', true);
    notification.innerHTML = `Slide ${currentIndex + 1} of ${slides.length}`;
};

export const initUI = Store => ({ nextButton, previousButton, navItems }) => {
    TRIGGER_EVENTS.forEach(triggerEvent => {
        if (nextButton) {
            nextButton.addEventListener(triggerEvent, event => {
                if (event.keyCode && event.keyCode !== KEY_CODES.ENTER) return;
                const { currentIndex, slides } = Store.getState();
                Store.dispatch({ currentIndex: currentIndex === slides.length - 1 ? 0 : currentIndex + 1 }, [ setCurrent ]);
            });
        }
        if (previousButton) {
            previousButton.addEventListener(triggerEvent, event => {
                if (event.keyCode && event.keyCode !== KEY_CODES.ENTER) return;
                const { currentIndex, slides } = Store.getState();
                Store.dispatch({ currentIndex: currentIndex === 0 ? slides.length - 1 : currentIndex - 1 }, [ setCurrent ]);
            });
        }
        navItems.length > 0 && this.navItems.forEach((item, i)	 => {
            item.addEventListener(triggerEvent, e => {
                if (e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
                this.change(i);
            });
        });
    });
};
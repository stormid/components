import createStore from './store';
import { findSlides, autoplay } from './shared';
import { setCurrent, initUI, preload }  from './dom';

/* 
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 * @param items, HTMLElement, DOM node to be toggled
 *
 * @returns Object, Slides API
 */
export default ({ node, settings }) => {
    const Store = createStore();
    const slides = findSlides(node, settings);
    const navItems = [].slice.call(node.querySelectorAll(settings.navItemSelector));

    if (navItems.length > 0 && navItems.length !== slides.length) return void console.warn('Slide navigation does not match the number of slides.');

    Store.dispatch({
        node,
        slides,
        navItems,
        nextButton: node.querySelector(settings.buttonNextSelector),
        previousButton: node.querySelector(settings.buttonPreviousSelector),
        notification: node.querySelector(settings.liveRegionSelector),
        currentIndex: settings.startIndex
    }, [ setCurrent, initUI(Store), preload(Store), autoplay(Store) ]);

    /*
        this.settings.autoPlay ? this.autoPlay(this.settings.slideDuration) : null;
        */
    return {
        getState: Store.getState,
        next(){
            const { currentIndex, slides } = Store.getState();
            Store.dispatch({ currentIndex: currentIndex === slides.length - 1 ? 0 : currentIndex + 1 }, [ setCurrent ]);
        },
        previous(){
            const { currentIndex, slides } = Store.getState();
            Store.dispatch({ currentIndex: currentIndex === 0 ? slides.length - 1 : currentIndex - 1 }, [ setCurrent ]);
        },
        gotToIndex(index){
            const { slides } = Store.getState();
            if (index < 0 || index > slides.length - 1) return void console.warn('The requested index is out of range');
            Store.dispatch({ currentIndex: index }, [ setCurrent ]);
        }
    };
};
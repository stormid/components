import { initUI, next, previous, close } from '../../src/lib/dom';
import { createStore } from '../../src/lib/store';
import defaults from '../../src/lib/defaults/';

describe(`Modal Gallery > DOM > initUI`, () => {

    it('should add create the modal UI, update the state with references to the rendered dom elements, and toggle the UI state', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [{  src: 'https://placehold.it/500x500' }],
            keyListener: jest.fn()
        });
        initUI(Store)(Store.getState());
        const overlay = document.querySelector('.js-modal-gallery__inner');
        const domItems = [].slice.call(overlay.querySelectorAll('.js-modal-gallery__item'));
        expect(overlay).not.toBeNull;
        expect(Store.getState().dom.overlay.classList.contains('is--active')).toEqual(true);
        expect(Store.getState().dom.overlay.getAttribute('aria-hidden')).toEqual('false');
        expect(domItems).not.toBeNull;
        expect(domItems.length).toEqual(1);
    });
    
});

describe(`Modal Gallery > DOM > next`, () => {
    
    it('should navigate to the next item', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());        
        next(Store);

        expect(Store.getState().current).toEqual(1);
        expect(Store.getState().dom.items[0].classList.contains('is--active')).toEqual(false);
        expect(Store.getState().dom.items[1].classList.contains('is--active')).toEqual(true);

    });

    it('should navigate to the first item if on the last', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 2,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());        
        next(Store);

        expect(Store.getState().current).toEqual(0);
        expect(Store.getState().dom.items[2].classList.contains('is--active')).toEqual(false);
        expect(Store.getState().dom.items[0].classList.contains('is--active')).toEqual(true);

    });
});


describe(`Modal Gallery > DOM > previous`, () => {
    
    it('should navigate to the next item', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 1,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());        
        previous(Store);

        expect(Store.getState().current).toEqual(0);
        expect(Store.getState().dom.items[1].classList.contains('is--active')).toEqual(false);
        expect(Store.getState().dom.items[0].classList.contains('is--active')).toEqual(true);

    });

    it('should navigate to the last item if on the first', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 0,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());        
        previous(Store);

        expect(Store.getState().current).toEqual(2);
        expect(Store.getState().dom.items[0].classList.contains('is--active')).toEqual(false);
        expect(Store.getState().dom.items[2].classList.contains('is--active')).toEqual(true);

    });
});


describe(`Modal Gallery > DOM > close`, () => {
    
    it('should close the modal and update the state', () => {
        document.body.innerHTML = ``;
        const Store = createStore();
        Store.dispatch({
            isOpen: true,
            current: 1,
            settings: defaults,
            imageCache: [],
            items: [
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' },
                { src: 'https://placehold.it/500x500' }
            ],
            keyListener: jest.fn()
        });

        initUI(Store)(Store.getState());         
        expect(Store.getState().current).toEqual(1);
        expect(Store.getState().dom.items[1].classList.contains('is--active')).toEqual(true);

        close(Store);
        const overlay = document.querySelector('.js-modal-gallery__inner');
        expect(overlay).toBeNull;
        expect(Store.getState().isOpen).toEqual(false);
        expect(Store.getState().current).toEqual(null);

    });

});

// const close = Store => {
//     const { keyListener, lastFocused, dom, current } = Store.getState();
//     Store.dispatch({ current: null, isOpen: false }, [
//         () => document.removeEventListener('keydown', keyListener),
//         () => { if(lastFocused) lastFocused.focus() },
//         () => dom.items[current].classList.remove('is--active'),
//         toggle(Store),
//         () => dom.overlay.parentNode.removeChild(dom.overlay)
//     ]);
// };

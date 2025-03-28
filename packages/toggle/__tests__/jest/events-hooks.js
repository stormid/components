import toggle from '../../src';
import { EVENTS } from '../../src/lib/constants';

describe('Toggle > lifecycle > prehook', () => {
    let prehookToggle, prehook;
    beforeEach(() => {
        document.body.innerHTML = `<button class="js-toggle__prehook-btn">Test toggle</button>
            <div id="target-2" class="js-toggle__prehook" data-toggle="js-toggle__prehook-btn"></div>`;
        prehook = jest.fn();
        prehookToggle= toggle('.js-toggle__prehook', {
            prehook
        })[0];
    });

    it('should bypass the prehook if toggle is invoked outwith lifecycle', async () => {
        prehookToggle.toggle();
        expect(prehook).not.toHaveBeenCalled();
    });
    
    it('should call the prehook before toggle with node, toggles and isOpen properties of state', async () => {
        let { node, toggles } = prehookToggle.getState();
        prehookToggle.startToggle();
        expect(prehook).toHaveBeenCalledWith({ node, toggles, isOpen: false });
    });
});

describe('Toggle > events', () => {

    it('should dispatch an custom event when opening and closing with a reference to the instance getState', () => {
        
        document.body.innerHTML = `<button class="js-toggle__events-btn">Test toggle</button>
        <div id="target--events" class="js-toggle__events" data-toggle="js-toggle__events-btn"></div>`;
        const instance = toggle('.js-toggle__events')[0];
        const node = document.getElementById('target--events');
        const button = document.querySelector('.js-toggle__events-btn');

        const listener = jest.fn();
        node.addEventListener(EVENTS.OPEN, listener); 
        node.addEventListener(EVENTS.OPEN, e => {
            expect(e.detail.getState).toBeDefined();
            expect(e.detail.getState().node).toEqual(node);
            expect(e.detail.getState().isOpen).toEqual(true);
        });
        
        node.addEventListener(EVENTS.CLOSE, listener); 
        node.addEventListener(EVENTS.CLOSE, e => {
            expect(e.detail.getState).toBeDefined();
            expect(e.detail.getState().node).toEqual(node);
            expect(e.detail.getState().isOpen).toEqual(false);
        });

        //start closed
        expect(instance.getState().isOpen).toEqual(false);

        //open
        button.click();
        expect(instance.getState().isOpen).toEqual(true);
        expect(listener).toHaveBeenCalled();

        //close
        button.click();
        expect(instance.getState().isOpen).toEqual(false);
        expect(listener).toHaveBeenCalled();
    });
});
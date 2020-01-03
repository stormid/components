import { FOCUSABLE_ELEMENTS, TRIGGER_EVENTS, TRIGGER_KEYCODES } from './constants';

/*
 * Sets aria attributes and adds eventListener on each toggle button
 * 
 * @param Store, Object, model or state of the current instance
 */
export const initUI = Store => () => {
    const { toggles } = Store.getState();

    toggles.forEach(toggle => {
        //validate aria of controls
        
        TRIGGER_EVENTS.forEach(ev => {
            toggle.addEventListener(ev, e => {
                if (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3)) return;
                e.preventDefault();
            });
        });
    });
};


/*
 * Partially applied function that returns a handler function for keydown events when toggle is open
 * Only added as an eventListener when trapTab option is set
 * 
 * @param Store, Object, model or store of the current instance
 * @returns Function, keyboard event handler
 * 
 * @param Event, document keydown event dispatched from document
 */
export const keyListener = Store => e => {
    switch (e.keyCode){
    case 27:
        e.preventDefault();
        break;
    case 9:
        break;
    }
};
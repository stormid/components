import { FOCUSABLE_ELEMENTS, TRIGGER_EVENTS, KEYCODES } from './constants';

/*
 * Returns an HTMLElement child of the supplied node with a role of dialog
 * 
 * @param node, HTMLElement, tab container
 * @param settings, Object, settings of the 
 * @return HTMLElement
 */
export const findDialog = node => node.querySelector('[role=dialog]') || console.warn(`No dialog found in modal node '${sel}'`);

/*
 * Returns an Array of HTMLElements selected based on data-toggle attribute of a given node
 * 
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements
 */
export const findToggles = (node, settings) => {
    const toggles = node.getAttribute(settings.toggleSelectorAttribute) && Array.from(document.querySelectorAll('.' + node.getAttribute(settings.toggleSelectorAttribute)));
    if(!toggles) throw console.warn(`Modal cannot be initialised, no toggle elements found for ${node}. Does it have a ${settings.toggleSelectorAttribute} attribute that identifies toggle buttons?`);
    return toggles;
}

 /* Returns an Array of HTMLElements selected from parentNode based on whitelist FOCUSABLE_ELEMENTS constant
 * 
 * @param node, HTMLElement, node to be toggled
 * @return Array of HTMLElements
 */
export const getFocusableChildren = node => Array.from(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));


/*
 * 
 * 
 * @param 
 *
 */
export const toggle = Store => () => {
    console.log('toggle');
};

/*
 * Sets aria attributes and adds eventListener on each tab
 * 
 * @param Store, Object, model or state of the current instance
 */
export const initUI = Store => ({ dialog, toggles }) => { 
   dialog.setAttribute('aria-hidden', true);
   //check aria-labelledby= an id in the dialog
   toggles.forEach(tgl => {
        TRIGGER_EVENTS.forEach(ev => {
            tgl.addEventListener(ev, e => {
                if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3)) return;
                e.preventDefault();
                Store.dispatch({ isOpen: !Store.getState().isOpen }, [ toggle(Store) ]);
            });
        });
    });
};
import { TRIGGER_EVENTS, DATA_ATTRIBUTES, LISTENER_OPTIONS } from '../constants';
import { handler, composeAction } from '../shared';

export default __m => {
    const nodes = [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.ADD}]`));
    if (nodes.length === 0) return;
    
    for (let index in nodes){
        TRIGGER_EVENTS.forEach(ev => {
            nodes[index].addEventListener(ev, handler(composeAction({ node: nodes[index], action: 'add', event: 'Add to Cart' }), __m), LISTENER_OPTIONS);
        });
    }
};
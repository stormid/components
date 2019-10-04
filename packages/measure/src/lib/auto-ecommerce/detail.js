import { DATA_ATTRIBUTES } from './constants';
import { composeAction } from './shared';

export default __m => {
    const nodes = [].slice.call(document.querySelectorAll(`[${DATA_ATTRIBUTES.DETAIL}]`));
    if(nodes.length === 0) return;
    
    for(let node of nodes){
        __m.ecommerce.action(composeAction({ node, action: 'detail', event: 'Product Detail' }));
    }
};
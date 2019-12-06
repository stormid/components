import { DATA_ATTRIBUTES } from '../constants';
import { composeCheckoutAction } from '../shared';

export default __m => {
    const node = document.querySelector(`[${DATA_ATTRIBUTES.CHECKOUT_STEP}]`);
    if(!node) return;
    
    __m.ecommerce.action(composeCheckoutAction({ node, action: 'checkout', event: 'Checkout' }));
};
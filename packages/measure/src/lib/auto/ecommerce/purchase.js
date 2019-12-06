import { DATA_ATTRIBUTES } from '../constants';
import { composePurchaseAction } from '../shared';

export default __m => {
    const node = document.querySelector(`[${DATA_ATTRIBUTES.PURCHASE}]`);
    if(!node) return;
    __m.ecommerce.action(composePurchaseAction({ node, action: 'purchase', event: 'Purchase' }));
};
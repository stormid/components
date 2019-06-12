import { request, composeURL, cacheBuster } from '../utils';
import { clear } from '../reducers';
import { PATH } from '../constants';

export const send = (Store, type = 'pageview') => ({ persistent, stack }) => {
    request(composeURL({
        data: {
            ...persistent,
            ...stack,
            t: type,
            z: cacheBuster()
        }, 
        action: PATH
    }));
    Store.dispatch(clear, {});
};
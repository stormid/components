import { cacheBuster} from '../shared/data';
import { clear } from '../reducers';
import { request } from '../shared/request';
import { url } from '../shared/compose';
import {
    PATH
} from '../constants';

export const send = (Store, type = 'event') => ({ stack }) => {
    const persistent = Store.getState().persistent;
    request(url({
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

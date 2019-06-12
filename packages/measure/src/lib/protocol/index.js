import { request, composeURL, cacheBuster } from '../utils';
import { PATH } from '../constants/analytics';

export const send = (type = 'pageview') => state => {
    request(composeURL({ data: { ...state.data, t: type, z: cacheBuster() }, action: PATH  }));
};
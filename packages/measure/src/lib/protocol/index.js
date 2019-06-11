import { request, composeURL } from '../utils';
import { PATH } from '../constants/analytics';

export const send = (type = 'pageview') => state => {
    request(composeURL({ data: { ...state.data, t: type }, action: PATH  }));
};
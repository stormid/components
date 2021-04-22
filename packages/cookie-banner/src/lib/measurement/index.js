import { cacheBuster, request, dataToURL } from './utils';

export const measure = (state, measurements, urlAction = 'collect') => request(dataToURL({
    ...state.persistentMeasurementParams,
    ...measurements,
    ...(state.settings.debug ? {} : { z: cacheBuster() })
}, urlAction));
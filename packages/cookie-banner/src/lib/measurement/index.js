import { cacheBuster, request, dataToURL } from './utils';

export const measure = (state, measurements) => request(dataToURL({
    ...state.persistentMeasurementParams,
    ...measurements,
    t: 'event',
    z: cacheBuster()
}));
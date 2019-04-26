import { DATA_ATTRIBUTE } from './constants';

export const hasValue = set => set === undefined || [].slice.call(set.querySelectorAll('input, select')).reduce((acc, curr) => {
    if(curr.value !== '') acc = true;
    return acc;
}, false);

export const canAddSet = sets => {
    return sets.length === 0 || sets.reduce((acc, curr) => {
        if(!hasValue(curr)) acc = false;
        return acc;
    }, true);
};
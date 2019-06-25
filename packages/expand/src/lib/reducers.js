export const setInitialState = payload => payload;
export const show  = (payload, state) => ({ ...state, ...payload });
export const hide  = (payload, state) => ({ ...state, ...payload });
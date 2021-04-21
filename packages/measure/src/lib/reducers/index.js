export const initial = (state, data) => Object.assign({}, state, data);

export const add = (state, data) => Object.assign({}, state, { stack: Object.assign({}, state.stack, data ) });

export const clear = state => Object.assign({}, state, { stack: {} });
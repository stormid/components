export const setInitialState = payload => payload;

export const add = (payload, state) => ({
    ...state,
    sets: [ ...state.sets, payload ]
});

export const deleteSet = (payload, state) => ({  
    ...state,
    sets: state.sets.map((set, i) => i === +payload ? undefined : set)
});
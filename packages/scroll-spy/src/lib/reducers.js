export const addActive = (state, spy) => {
    if (state.active.includes(spy)) return state;
    return { ...state, active: [ ...state.active, spy ]  };
};

export const removeActive = (state, spy) => {
    if (!state.active.includes(spy)) return state;
    return { ...state, active: state.active.filter(item => item !== spy) };
};

export const setDirection = (state, direction) => {
    return { ...state, scrollDirectionY: direction };
};
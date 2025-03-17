export const addActive = (state, spy) => {
    if (state.active.includes(spy)) return state;
    return { ...state, active: [ ...state.active, spy ]  };
};

export const removeActive = (state, spy) => {
    if (!state.active.includes(spy)) return state;
    return { ...state, active: state.active.filter(item => item !== spy) };
};

export const setDirection = (state, direction) => {
    const { active } = state;

    console.log("before sort");
    console.table(active)

    if(active.length > 1) active.sort((a, b) => {
        console.log
        if (direction === 'down') return a.target.offsetTop - b.target.offsetTop;
        return b.target.offsetTop - a.target.offsetTop;
    });
    console.log("after sort");
    console.table(active)

    return { ...state, active: active };
};
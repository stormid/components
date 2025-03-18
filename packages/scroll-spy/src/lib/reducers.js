export const addActive = (state, spy) => {
    if (state.active.includes(spy)) return state;

    //Add the new active item to the array and re-sort it based on the target's current 
    //vertical position in the document
    const newActiveSpies = [ ...state.active, spy ].sort((a, b) => {
        return a.target.offsetTop - b.target.offsetTop;
    });

    return { ...state, active: newActiveSpies  };
};

export const removeActive = (state, spy) => {
    if (!state.active.includes(spy)) return state;
    return { ...state, active: state.active.filter(item => item !== spy) };
};

export const setScrolled = (state, scrolled) => {
    return { ...state, hasScrolledToBottom: scrolled };
};
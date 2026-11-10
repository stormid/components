export const createStore = () => {
    let state = {};
    
    const getState = () => state;

    const update = (nextState, effects) => {
        state = nextState ?? state;
        if (!effects) return;
        effects.forEach(effect => effect(state));
    };
    
    return { update, getState };
};
export const createStore = () => {
    let state = {};
    
    const getState = () => state;

    /**
     * Update state
     * Execute side effects of state update
     * 
     * @param nextState [Object] New slice of state to combine with current state to create next state
     * @param effects [Array] Array of side effect functions to invoke after state update (DOM, operations, cmds...)
     */
    const update = (nextState, effects) => {
        state = nextState ?? state;
        if (!effects) return;
        effects.forEach(effect => effect(state));
    };
    
    return { update, getState };

};
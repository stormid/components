export const createStore = () => {
    //shared centralised validator state
    let state = {};
    
    //state getter
    const getState = () => state;

    /**
     * Create next state by invoking reducer on current state
     * 
     * Execute side effects of state update, as passed in the update
     * 
     * @param reducer [Function] The operation to be performed to reduce state
     * @param payload [Object] New slice of state to combine with current state to create next state
     * @param effects [Array] Array of side effect functions to invoke after state update (DOM, operations, cmds...)
     */
    const dispatch = (reducer, payload, effects) => {
        state = (reducer && payload) ? reducer(payload, state) : state;
        effects && effects.forEach(effect => { effect(state); });
    };

    return { dispatch, getState };
};
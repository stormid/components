export default () => {
    //shared centralised validator state
    let state = {};

    //uncomment for debugging by writing state history to window
    // window.__validator_history__ = [];

    //state getter
    const getState = () => state;

    /**
     * Create next state by invoking reducer on current state
     * 
     * Execute side effects of state update, as passed in the update
     * 
     * @param nextState [Object] New slice of state to combine with current state to create next state
     * @param effects [Array] Array of side effect functions to invoke after state update (DOM, operations, cmds...)
     */
    const update = function(nextState, effects = []) {
        state = nextState ? { ...state, ...nextState } : state;
        //uncomment for debugging by writing state history to window
        // window.__validator_history__.push({[type]: state}), console.log(window.__validator_history__);
        effects.forEach(effect => { effect(state); });
    };

    return { update, getState };
};
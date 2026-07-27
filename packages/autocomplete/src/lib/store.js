/*
 * onUpdate, when supplied, is called with the previous and the new state after
 * every update — once the effects have run, so it observes a settled DOM. It's how
 * a caller reacts to a state transition without every update site having to
 * announce itself: see factory, which broadcasts open/close from it.
 */
export const createStore = onUpdate => {
    let state = {};

    const getState = () => state;

    const update = (nextState, effects) => {
        const previous = state;
        state = nextState ?? state;
        if (effects) effects.forEach(effect => effect(state));
        if (onUpdate) onUpdate(previous, state);
    };

    return { update, getState };
};
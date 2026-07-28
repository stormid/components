/*
 * onUpdate is called with the previous and the new state after every update, once the
 * effects have run — so a caller can react to a transition against a settled DOM
 * rather than having every update site announce itself (see factory).
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
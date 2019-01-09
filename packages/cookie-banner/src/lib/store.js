export default () => ({
    state: {},
    update(reducer, nextState, effects = []){ 
        this.state = reducer(this.state, nextState);
        if(effects.length > 0) effects.forEach(effect => { effect(this.state) });
    },
    getState() { return this.state }
});
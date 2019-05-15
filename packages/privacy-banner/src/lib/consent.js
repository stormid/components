export const apply = state => {
    //;_; needs proper enum

    // const appliedState = perf === 'add' 
    //                     ? Object.assign({}, state, { consent:  Object.assign({}, state.consent, { performance: true }) })
    //                     : perf === 'remove'
    //                     ?  Object.assign({}, state, { consent:  Object.assign({}, state.consent, { performance: false })})
    //                     : state;
    
    Object.keys(state.consent).forEach(key => {
        (state.consent[key] && Boolean(state.settings.types[key])) && state.settings.types[key].fns.forEach(fn => fn(state));
    });
};
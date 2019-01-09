export const apply = (perf = 'add') => state => {
    //;_; needs proper enum
    const appliedState = perf === 'add' 
                        ? Object.assign({}, state, { consent:  Object.assign({}, state.consent, { performance: true }) })
                        : perf === 'remove'
                        ?  Object.assign({}, state, { consent:  Object.assign({}, state.consent, { performance: false })})
                        : state;

    Object.keys(appliedState.consent).forEach(key => {
        (appliedState.consent[key] && appliedState.settings.types[key]) && appliedState.settings.types[key].fns.forEach(fn => fn(appliedState));
    });
};
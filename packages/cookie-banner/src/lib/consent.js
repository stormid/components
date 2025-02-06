import { updateExecuted } from './reducers';

export const applyEffects = state => {
    Object.keys(state.consent).forEach(key => {
        if (!state.settings.types[key]) return;
        if (state.settings.types[key].executed === true) return;
        if (state.consent[key] && Boolean(state.consent[key]) && state.settings.types[key].fns) {
            state.settings.types[key].fns.forEach(fn => fn(state));
        }
    });
};

export const apply = Store => state => {
    applyEffects(state);
    Store.update(
        updateExecuted(
            state,
            Object.keys(state.settings.types).reduce((acc, type) => {
                acc[type] = Object.assign({}, state.settings.types[type], { executed: state.settings.types[type].executed || (state.consent[type] && Boolean(state.consent[type])) });
                return acc;
            }, {})
        )
    );
};

export const necessary = state => {
    state.settings.necessary.forEach(fn => fn(state));
};
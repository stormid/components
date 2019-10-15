export const initialState = (state, data) => Object.assign({}, state, data);

export const updateConsent = (state, data) => Object.assign({}, state, { consent: Object.assign({}, state.consent, data)});

export const updateExecuted = (state, data) => Object.assign({}, state, { settings: Object.assign({}, state.settings, { types: Object.assign({}, state.settings.types, data) })});
export const initialState = (state, data) => ({ ...state, ...data });
// export const setConsent = (state, data) => ({ ...state, ...data});
export const fullConsent = (state, data) => ({ ...state, consent: data });
export const updateConsent = (state, data) => ({ ...state, consent: { ...state.consent, ...data }});
export const updateExecuted = (state, data) => ({ ...state, settings: {
    ...state.settings,
    types: {
        ...state.settings.types,
        ...data
    }
}});
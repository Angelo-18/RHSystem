import { createSlice } from '@reduxjs/toolkit';

export const justificationsSlice = createSlice({
    name: 'justifications',
    initialState: {
        isLoading: false,
        justifications: [],
        activeJustification: null,
        errorMessage: null
    },
    reducers: {
        startLoadingJustifications: (state) => {
            state.isLoading = true;
            state.errorMessage = null;
        },
        setJustifications: (state, { payload }) => {
            state.isLoading = false;
            state.justifications = payload;
        },
        addJustification: (state, { payload }) => {
            state.justifications.push(payload);
        },
        updateJustification: (state, { payload }) => {
            state.justifications = state.justifications.map(justification =>
                justification.id === payload.id ? payload : justification
            );
        },
        setActiveJustification: (state, { payload }) => {
            state.activeJustification = payload;
        },
        clearActiveJustification: (state) => {
            state.activeJustification = null;
        },
        setError: (state, { payload }) => {
            state.errorMessage = payload;
            state.isLoading = false;
        },
        deleteJustification: (state, { payload }) => {
            state.justifications = state.justifications.filter(justification => justification.id !== payload);
        }
    }
});

export const {
    startLoadingJustifications,
    setJustifications,
    setActiveJustification,
    clearActiveJustification,
    addJustification,
    updateJustification,
    setError,
    deleteJustification
} = justificationsSlice.actions;

export default justificationsSlice.reducer;
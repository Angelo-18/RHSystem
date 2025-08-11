import { createSlice } from '@reduxjs/toolkit';

export const personalSlice = createSlice({
    name: 'personal',
    initialState: {
        isLoading: false,
        personalList: [],
        activePersonal: null,
        errorMessage: null
    },
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
        },
        setPersonalList: (state, { payload }) => {
            state.isLoading = false;
            state.personalList = payload;
        },
        setActivePersonal: (state, { payload }) => {
            state.activePersonal = payload;
        },
        updatePersonalStatus: (state, { payload }) => {
            state.personalList = state.personalList.map(personal => {
                if (personal.uid === payload.uid) {
                    return { ...personal, ...payload };
                }
                return personal;
            });
            if (state.activePersonal?.uid === payload.uid) {
                state.activePersonal = { ...state.activePersonal, ...payload };
            }
        },
        clearPersonalState: (state) => {
            state.isLoading = false;
            state.personalList = [];
            state.activePersonal = null;
            state.errorMessage = null;
        },
        setError: (state, { payload }) => {
            state.isLoading = false;
            state.errorMessage = payload;
        }
    }
});

export const {
    setLoading,
    setPersonalList,
    setActivePersonal,
    updatePersonalStatus,
    clearPersonalState,
    setError
} = personalSlice.actions;
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking', 'not-authenticated', 'authenticated', 'pending-approval'
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
        errorMessage: null,
        isRegistered: false,
        isActive: false,
    },
    reducers: {
        login: ( state, { payload } ) => {
            state.status = payload.isRegistered && payload.isActive ? 'authenticated' : 'pending-approval';
            state.uid = payload.uid;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL;
            state.errorMessage = null;
            state.isRegistered = payload.isRegistered || false;
            state.isActive = payload.isActive || false;
        },
        logout: ( state, { payload } ) => {
            state.status = 'not-authenticated';
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoURL = null;
            state.errorMessage = payload?.errorMessage;
            state.isRegistered = false;
            state.isActive = false;
        },
        checkingCredentials: (state) => {
            state.status = 'checking';
        },
        setPendingApproval: (state) => {
            state.status = 'pending-approval';
        },
        updateRegistrationStatus: (state, { payload }) => {
            state.isRegistered = payload.isRegistered;
            state.isActive = payload.isActive;
            state.status = payload.isRegistered && payload.isActive ? 'authenticated' : 'pending-approval';
        }
    }
});


// Action creators are generated for each case reducer function
export const { login, logout, checkingCredentials, setPendingApproval, updateRegistrationStatus } = authSlice.actions;
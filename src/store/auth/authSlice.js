import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking' | 'not-authenticated' | 'authenticated' | 'pending-approval' | 'pending-registration'
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
        errorMessage: null,
        isRegistered: false,
        isActive: false,
        userProfile: 'colaborador' // 'admin' | 'colaborador' | 'recursos_humanos' | 'supervisor'
    },
    reducers: {
        login: (state, { payload }) => {
            state.status = payload.status;
            state.uid = payload.uid;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL;
            state.errorMessage = null;
            state.isRegistered = payload.isRegistered;
            state.isActive = payload.isActive;
            state.userProfile = payload.userProfile || 'colaborador';
        },
        logout: (state, { payload }) => {
            state.status = 'not-authenticated';
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoURL = null;
            state.errorMessage = payload?.errorMessage;
            state.isRegistered = false;
            state.isActive = false;
            state.userProfile = 'colaborador';
        },
        checkingCredentials: (state) => {
            state.status = 'checking';
        },
        updateRegistrationStatus: (state, { payload }) => {
            state.isRegistered = payload.isRegistered;
            state.isActive = payload.isActive;
            if (payload.isRegistered) {
                state.status = payload.isActive ? 'authenticated' : 'pending-approval';
            } else {
                state.status = payload.pendingRegistration ? 'pending-registration' : 'not-authenticated';
            }
        },
        updateUserProfile: (state, { payload }) => {
            state.userProfile = payload.userProfile;
        }
    }
});

export const { login, logout, checkingCredentials, updateRegistrationStatus, updateUserProfile } = authSlice.actions;